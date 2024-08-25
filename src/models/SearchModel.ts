import mongoose, { Schema } from "mongoose";
import { SearchStatus } from "../interfaces/schemaTypes/enums/SearchStatus";
import Search from "../interfaces/schemaTypes/Search";

const SearchSchema: Schema<Search> = new Schema({
    patient: { type: Schema.Types.ObjectId, ref: "User", required: true },
    medication: {
        type: Schema.Types.ObjectId,
        ref: "Medication",
        required: true,
    },
    status: { type: String, enum: Object.values(SearchStatus), required: true },
    location: {
        type: {
            type: String,
            enum: ["Point"],
            required: true,
        },
        coordinates: {
            type: [Number],
            required: true,
        },
    },
    zipCode: { type: Number, required: true },
    prescriberName: { type: String },
});

export default mongoose.model<Search>("Search", SearchSchema);
