import { Router } from "express";
import otpController from "../controllers/otpController";
import asyncHandler from "../middleware/asyncHandler";

const OTPRouter = Router();

OTPRouter.post("/send", asyncHandler(otpController.sendOtp));
OTPRouter.post("/verify", asyncHandler(otpController.verifyOtp));

export default OTPRouter;
