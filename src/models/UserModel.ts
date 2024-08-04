import mongoose, { Schema } from "mongoose";
import { UserType } from "../interfaces/schemaTypes/enums/UserType";
import { User } from "../interfaces/schemaTypes/User";

const UserSchema: Schema<User> = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String },
    password: { type: String, required: true },
    dateOfBirth: { type: Date },
    zipCode: { type: String },
    userType: { type: String, enum: Object.values(UserType), required: true },
    doctorName: { type: String },
    doctorEmail: { type: String },
});

export default mongoose.model<User>("User", UserSchema);
