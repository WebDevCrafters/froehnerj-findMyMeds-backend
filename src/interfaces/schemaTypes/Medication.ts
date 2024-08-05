import { Types } from "mongoose";

interface Medication {
    _id: Types.ObjectId;
    name: string;
    dose: string;
    quantity: number;
    alternatives: Types.ObjectId[];
    pickUpDate: number;
}

export default Medication;
