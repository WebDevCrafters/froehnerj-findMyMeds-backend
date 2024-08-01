import mongoose, { Schema, Document } from 'mongoose';
import { MedicationStatus } from '../interfaces/schemaTypes/enums/MedicationStatus';
import { Medication } from '../interfaces/schemaTypes/Medication';

const MedicationSchema: Schema = new Schema({
    medicationId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    dose: { type: String, required: true },
    quantity: { type: Number, required: true },
    brandName: { type: String, required: true },
    alternatives: { type: [String] },
    earliestPickupDate: { type: Date, required: true },
    status: { type: String, enum: Object.values(MedicationStatus), required: true }
});

export default mongoose.model<Medication>('Medication', MedicationSchema);
