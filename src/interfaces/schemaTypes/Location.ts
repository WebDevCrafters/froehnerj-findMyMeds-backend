import { Types } from "mongoose";

interface Location {
    locationId: Types.ObjectId;
    zipCode: string;
    longitude: string;
    latitude: string;
}

export default Location;
