import mongoose, { Schema } from "mongoose";
import Location from "../interfaces/schemaTypes/Location";

const LocationSchema: Schema<Location> = new Schema({
    zipCode: { type: String, required: true },
    longitude: { type: String, required: true },
    latitude: { type: String, required: true },
});

export default mongoose.model<Location>("Location", LocationSchema);
