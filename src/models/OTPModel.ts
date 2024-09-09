import mongoose, { Schema, Document } from "mongoose";
import { Otp } from "../interfaces/schemaTypes/OTP";

const OtpSchema: Schema = new Schema({
    email: { type: String, required: true, unique: true },
    otp: { type: String, required: true },
    expiresAt: { type: Date, required: true },
});

export const OtpModel = mongoose.model<Otp>("Otp", OtpSchema);
