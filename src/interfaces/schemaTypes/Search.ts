import { Types } from "mongoose";
import { SearchStatus } from "./enums/SearchStatus";
import User from "./User";
import Medication from "./Medication";

interface Search {
    searchId?: Types.ObjectId;
    patient: Types.ObjectId | User;
    medication: Types.ObjectId | Medication;
    status: SearchStatus;
}

export default Search;
