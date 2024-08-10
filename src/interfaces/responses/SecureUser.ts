import { Types } from "mongoose";
import { UserType } from "../schemaTypes/enums/UserType";

interface SecureUser {
    _id: Types.ObjectId;
    email: string;
    phoneNumber: string;
    name: string;
    userType: UserType;
    dob: number;
    doctorId: Types.ObjectId;
    locationId: Types.ObjectId;
}

export default SecureUser;