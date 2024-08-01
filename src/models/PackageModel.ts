import mongoose, { Schema, Document } from 'mongoose';
import { Package } from '../interfaces/schemaTypes/Package';

const PackageSchema: Schema = new Schema({
    packageId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    details: { type: String, required: true }
});

export default mongoose.model<Package>('Package', PackageSchema);
