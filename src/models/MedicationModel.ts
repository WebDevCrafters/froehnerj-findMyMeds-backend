import mongoose, { Schema } from "mongoose";
import Medication from "../interfaces/schemaTypes/Medication";

const MedicationSchema: Schema<Medication> = new Schema({
    name: { type: String, required: true },
    dose: { type: String },
    quantity: { type: Number },
    alternatives: [
        {
            type: Schema.Types.ObjectId,
            ref: "Medication",
        },
    ],
    pickUpDate: { type: Number },
    brandName: { type: String }
});

export default mongoose.model<Medication>("Medication", MedicationSchema);
