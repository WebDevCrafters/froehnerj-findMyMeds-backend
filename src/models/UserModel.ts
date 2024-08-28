import mongoose, { Schema } from "mongoose";
import User from "../interfaces/schemaTypes/User";
import { UserType } from "../interfaces/schemaTypes/enums/UserType";

const UserSchema: Schema<User> = new Schema({
    email: { type: String, required: true },
    phoneNumber: { type: String },
    name: { type: String, required: true },
    userType: { type: String, enum: Object.values(UserType), required: true },
    dob: { type: Number },
    password: { type: String, required: true },
    doctorId: { type: Schema.Types.ObjectId, ref: "Doctor" },
    zipCode: { type: Number, required: true },
    location: {
        type: {
            type: String,
            enum: ["Point"],
            required: true,
        },
        coordinates: {
            type: [Number],
            required: true,
        },
    },
});


export default mongoose.model<User>("User", UserSchema);
