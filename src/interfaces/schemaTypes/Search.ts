import { Types } from "mongoose";
import { SearchStatus } from "./enums/SearchStatus";

interface Search {
    _id: Types.ObjectId;
    patientId: Types.ObjectId;
    medicationId: Types.ObjectId;
    status: SearchStatus;
}

export default Search;
