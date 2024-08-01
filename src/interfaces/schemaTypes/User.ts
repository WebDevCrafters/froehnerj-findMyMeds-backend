import { UserType } from "./enums/UserType";

export interface User {
    userId: string;
    name: string;
    email: string;
    phoneNumber: string;
    password: string;
    dateOfBirth: Date;
    zipCode: string;
    userType: UserType;
    doctorName?: string;
    doctorEmail?: string;
}
