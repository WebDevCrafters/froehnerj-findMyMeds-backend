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
            subject: "FindMyMeds Verification",
            html: this.generateOtpMailBody(otp),
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

    generateOtpMailBody(otp: string) {
        return `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
            <h2 style="text-align: center; color: #f55e25;">FindMyMeds Verification</h2>
            <p>Dear User,</p>
            <p>We received a request to verify your email address for <strong>FindMyMeds</strong>. Please use the following One-Time Password (OTP) to complete your verification process:</p>
            
            <div style="text-align: center; padding: 10px; margin: 20px 0; font-size: 24px; font-weight: bold; color: #f55e25; border: 1px solid #f55e25; border-radius: 8px; display: inline-block;">
              ${otp}
            </div>
            
            <p>This OTP is valid for the next <strong>10 minutes</strong>. Please do not share it with anyone.</p>
            
            <p>If you did not request this verification, you can safely ignore this email.</p>
            
            <p>Thank you for choosing FindMyMeds!</p>
            
            <p style="margin-top: 40px;">Best regards,<br/>FindMyMeds Team</p>
            
            <hr style="margin-top: 40px; border: 0; border-top: 1px solid #e0e0e0;"/>
            <p style="font-size: 12px; color: #999;">This is an automated email, please do not reply.</p>
          </div>
        `;
    }
}

export default new OTPService();
