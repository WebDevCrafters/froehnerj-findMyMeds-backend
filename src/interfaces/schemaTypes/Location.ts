import { Types } from "mongoose";

interface Location {
    _id: Types.ObjectId;
    zipCode: string;
    longitude: string;
    latitude: string;
}

export default Location;
