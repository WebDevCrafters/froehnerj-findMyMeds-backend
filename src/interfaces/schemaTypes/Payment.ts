import { Types } from "mongoose";
import PaymentStatus from "./enums/PaymentStatus";

interface Payment {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    status: PaymentStatus;
    paidOn: number;
    amount: string;
}

export default Payment;
