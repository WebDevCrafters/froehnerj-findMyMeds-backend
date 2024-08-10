import { Types } from "mongoose";

interface Availability {
    availabilityId: Types.ObjectId;
    clinicianId: Types.ObjectId;
    search: Types.ObjectId;
}

export default Availability;
