import { Types } from "mongoose";

interface Doctor {
    doctorId: Types.ObjectId;
    name: string;
    email: string;
}

export default Doctor;
