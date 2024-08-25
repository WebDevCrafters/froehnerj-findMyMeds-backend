import { Types } from "mongoose";
import { UserType } from "../schemaTypes/enums/UserType";
import Location from "./Location";

interface SecureUser {
    userId: Types.ObjectId;
    email: string;
    phoneNumber: string;
    name: string;
    userType: UserType;
    dob: number;
    doctorId: Types.ObjectId;
    location: Location;
    zipCode: number
}

export default SecureUser;
