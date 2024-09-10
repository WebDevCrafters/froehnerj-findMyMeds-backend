import { Types } from "mongoose";
import { UserType } from "./enums/UserType";
import DBLocation from "./DBLocation";

interface User {
    _id: Types.ObjectId;
    email: string;
    phoneNumber: string;
    name: string;
    userType: UserType;
    dob: number;
    password: string;
    zipCode: string;
    doctorId: Types.ObjectId;
    location: DBLocation;
}

export default User;
