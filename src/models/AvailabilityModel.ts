import mongoose, { Schema } from "mongoose";
import Availability from "../interfaces/schemaTypes/Availability";

const AvailabilitySchema: Schema<Availability> = new Schema({
    clinician: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    search: { type: Schema.Types.ObjectId, required: true, ref: "Search" },
});

export default mongoose.model<Availability>("Availability", AvailabilitySchema);
