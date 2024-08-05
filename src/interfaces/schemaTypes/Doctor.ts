import { Types } from "mongoose";

interface Doctor {
    _id: Types.ObjectId;
    name: string;
    email: string;
}

export default Doctor;
