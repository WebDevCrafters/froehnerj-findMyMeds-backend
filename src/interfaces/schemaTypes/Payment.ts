import { Types } from "mongoose";
import PaymentStatus from "./enums/PaymentStatus";

interface Payment {
    paymentId: Types.ObjectId;
    userId: Types.ObjectId;
    subscriptionId: Types.ObjectId;
    status: PaymentStatus;
    paidOn: number;
}

export default Payment;
