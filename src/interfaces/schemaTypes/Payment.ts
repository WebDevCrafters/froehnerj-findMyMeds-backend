import { PaymentStatus } from "./enums/PaymentStatus";

export interface Payment {
    paymentId: string;
    userId: string;
    searchId: string;
    amount: number;
    status: PaymentStatus;
    paymentDate: Date;
}
