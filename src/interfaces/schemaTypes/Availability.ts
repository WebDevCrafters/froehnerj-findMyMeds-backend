import { Types } from "mongoose";

interface Availability {
    _id: Types.ObjectId;
    clinicianId: Types.ObjectId;
    searchId: Types.ObjectId;
}

export default Availability;
