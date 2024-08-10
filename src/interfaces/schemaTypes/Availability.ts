import { Types } from "mongoose";

interface Availability {
    availabilityId: Types.ObjectId;
    clinicianId: Types.ObjectId;
    searchId: Types.ObjectId;
}

export default Availability;
