import { Types } from "mongoose";
import { SearchStatus } from "./enums/SearchStatus";
import User from "./User";
import Medication from "./Medication";
import DBLocation from "./DBLocation";
import Location from "../responses/Location";

interface Search {
    searchId?: Types.ObjectId;
    patient?: Types.ObjectId | User;
    medication?: Types.ObjectId | Medication;
    status?: SearchStatus;
    zipCode?: string;
    location?: DBLocation | Location;
    prescriberName?: string;
    dob?: number;
    miles?: number;
}

export default Search;
