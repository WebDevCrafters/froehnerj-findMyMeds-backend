import mongoose, { Schema } from "mongoose";
import { SearchStatus } from "../interfaces/schemaTypes/enums/SearchStatus";
import Search from "../interfaces/schemaTypes/Search";

const SearchSchema: Schema<Search> = new Schema({
    patientId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    clinicianId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    medicationId: {
        type: Schema.Types.ObjectId,
        ref: "Medication",
        required: true,
    },
    status: { type: String, enum: Object.values(SearchStatus), required: true },
});

export default mongoose.model<Search>("Search", SearchSchema);
