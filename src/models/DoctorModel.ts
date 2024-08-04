import mongoose, { Schema } from "mongoose";
import Doctor from "../interfaces/schemaTypes/Doctor";

const DoctorSchema: Schema<Doctor> = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
});

export default mongoose.model<Doctor>("Doctor", DoctorSchema);
