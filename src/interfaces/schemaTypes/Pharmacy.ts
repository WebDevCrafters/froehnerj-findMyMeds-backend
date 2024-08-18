import { Types } from "mongoose";
import DBLocation from "./DBLocation";
import Location from "../responses/Location";

interface Pharmacy {
    pharmacyId: Types.ObjectId;
    name: string;
    address: string;
    phoneNumber: string;
    faxNumber: string;
    url: string;
    authorizedOfficialName: string;
    authorizedOfficialContactNumber: string;
    location: DBLocation | Location;
}

export default Pharmacy;
