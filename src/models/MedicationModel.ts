import mongoose, { Schema } from "mongoose";
import Medication from "../interfaces/schemaTypes/Medication";

const MedicationSchema: Schema<Medication> = new Schema({
    name: { type: String, required: true },
    dose: { type: String, required: true },
    quantity: { type: Number, required: true },
    alternatives: { type: [String], required: true },
    pickUpDate: { type: Number, required: true },
});

export default mongoose.model<Medication>("Medication", MedicationSchema);
