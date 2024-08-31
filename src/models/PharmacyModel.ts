import mongoose, { Schema } from "mongoose";
import Pharmacy from "../interfaces/schemaTypes/Pharmacy";

const PharmacySchema: Schema<Pharmacy> = new Schema({
    name: { type: String },
    address: { type: String },
    phoneNumber: { type: String },
    faxNumber: { type: String },
    url: { type: String },
    authorizedOfficialName: { type: String },
    authorizedOfficialContactNumber: { type: String },
    location: {
        type: { type: String, enum: ["Point"], required: true },
        coordinates: { type: [Number], required: true }, // [longitude, latitude]
    },
});

PharmacySchema.index({ location: "2dsphere" });

export default mongoose.model<Pharmacy>("Pharmacy", PharmacySchema);
