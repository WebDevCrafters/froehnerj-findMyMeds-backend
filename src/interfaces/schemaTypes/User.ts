import { Document } from "mongoose";
import { UserType } from "./enums/UserType";

export interface User  extends Document{
    name: string;
    email: string;
    password: string;
    userType: UserType;
    phoneNumber?: string;
    dateOfBirth?: Date;
    zipCode?: string;
    doctorName?: string;
    doctorEmail?: string;
}
