import mongoose, { Schema } from "mongoose";
import Availability from "../interfaces/schemaTypes/Availability";

const AvailabilitySchema: Schema<Availability> = new Schema({
    clinicianId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    searchId: { type: Schema.Types.ObjectId, required: true, ref: "Search" },
});

export default mongoose.model<Availability>("Availability", AvailabilitySchema);
