import mongoose, { Schema } from 'mongoose';
import { UserType } from '../interfaces/schemaTypes/enums/UserType';
import { User } from '../interfaces/schemaTypes/User';

const UserSchema: Schema = new Schema({
    userId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    password: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    zipCode: { type: String, required: true },
    userType: { type: String, enum: Object.values(UserType), required: true },
    doctorName: { type: String },
    doctorEmail: { type: String }
});

export default mongoose.model<User>('User', UserSchema);
