import { Types } from "mongoose";
import { SearchStatus } from "./enums/SearchStatus";

interface Search extends Document {
    patientId: Types.ObjectId;
    clinicianId: Types.ObjectId;
    medicationId: Types.ObjectId;
    status: SearchStatus;
}

export default Search;
