import { Types } from "mongoose";

interface Medication extends Document {
    name: string;
    dose: string;
    quantity: number;
    alternatives: Types.ObjectId[];
    pickUpDate: number;
}

export default Medication;
