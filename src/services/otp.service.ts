import { randomInt } from "crypto";
import nodemailer from "nodemailer";
import { OtpModel } from "../models/OTPModel";
import dotenv from "dotenv";
dotenv.config();

class OTPService {
    async generateOtp(email: string): Promise<string> {
        const otp = randomInt(100000, 999999).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        await OtpModel.findOneAndUpdate(
            { email },
            { email, otp, expiresAt },
            { upsert: true, new: true }
        );

        return otp;
    }

    async sendOtpEmail(email: string, otp: string): Promise<void> {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.OTP_EMAIL,
                pass: process.env.OTP_EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.OTP_EMAIL,
            to: email,
            subject: "Your OTP Code",
            text: `Your OTP is ${otp}. It will expire in 10 minutes.`,
        };

        await transporter.sendMail(mailOptions);
    }

    async verifyOtp(email: string, otp: string): Promise<boolean> {
        const otpRecord = await OtpModel.findOne({ email });

        if (!otpRecord) {
            return false;
        }

        if (otpRecord.otp === otp && otpRecord.expiresAt > new Date()) {
            await OtpModel.deleteOne({ email });
            return true;
        }

        return false;
    }
}

export default new OTPService();