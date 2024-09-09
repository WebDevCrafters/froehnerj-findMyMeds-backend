import { Request, Response } from "express";
import otpService from "../services/otp.service";

class OTPController {
    async sendOtp(req: Request, res: Response): Promise<void> {
        const { email } = req.body;

        const otp = await otpService.generateOtp(email);
        await otpService.sendOtpEmail(email, otp);
        res.status(200).json({ message: "OTP sent successfully" });
    }

    async verifyOtp(req: Request, res: Response): Promise<void> {
        const { email, otp } = req.body;

        const isValid = await otpService.verifyOtp(email, otp);
        if (isValid) {
            res.status(200).json({ message: "OTP verified successfully" });
        } else {
            res.status(400).json({ message: "Invalid or expired OTP" });
        }
    }
}

export default new OTPController();
