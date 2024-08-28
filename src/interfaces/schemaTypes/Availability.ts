import { Types } from "mongoose";
import SecureUser from "../responses/SecureUser";

interface Availability {
    availabilityId: Types.ObjectId;
    clinician: Types.ObjectId | SecureUser;
    search: Types.ObjectId;
    markedOn: number;
}

export default Availability;
