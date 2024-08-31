import { Types } from "mongoose";

interface Medication {
    medicationId: Types.ObjectId;
    name: string;
    dose: string;
    quantity: number;
    alternatives: (Types.ObjectId | Medication)[];
    pickUpDate: number;
    brandName: string
}

export default Medication;
