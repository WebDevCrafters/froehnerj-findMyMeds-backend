import { Types } from "mongoose";
import PaymentStatus from "./enums/PaymentStatus";
import Subscription from "./Subscription";

interface Payment {
    paymentId?: Types.ObjectId;
    userId: Types.ObjectId;
    subscription: Types.ObjectId | Subscription;
    status?: PaymentStatus;
    paidOn?: number;
    searchesConsumed: number;
}

export default Payment;
