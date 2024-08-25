import { Types } from "mongoose";
import { SearchStatus } from "./enums/SearchStatus";
import User from "./User";
import Medication from "./Medication";
import DBLocation from "./DBLocation";
import Location from "../responses/Location";

interface Search {
    searchId?: Types.ObjectId;
    patient: Types.ObjectId | User;
    medication: Types.ObjectId | Medication;
    status: SearchStatus;
    zipCode: number;
    location: DBLocation | Location;
    prescriberName: string;
}

export default Search;
