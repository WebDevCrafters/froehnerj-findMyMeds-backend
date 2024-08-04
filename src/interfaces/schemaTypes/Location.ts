import { Document } from "mongoose";

interface Location extends Document {
    zipCode: string;
    longitude: string;
    latitude: string;
}

export default Location;
