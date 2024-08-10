import { Types } from "mongoose";
import PaymentStatus from "./enums/PaymentStatus";

interface Payment {
    paymentId: Types.ObjectId;
    userId: Types.ObjectId;
    status: PaymentStatus;
    paidOn: number;
    amount: string;
}

export default Payment;
