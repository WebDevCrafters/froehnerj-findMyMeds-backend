import { Types } from "mongoose";

interface Availability extends Document {
    clinicianId: Types.ObjectId;
    searchId: Types.ObjectId;
}

export default Availability;
