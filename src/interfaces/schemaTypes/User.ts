import { Types } from "mongoose";
import { UserType } from "./enums/UserType";

interface User {
    _id: Types.ObjectId;
    email: string;
    phoneNumber: string;
    name: string;
    userType: UserType;
    dob: number;
    password: string;
    doctorId: Types.ObjectId;
    locationId: Types.ObjectId;
}

export default User;
