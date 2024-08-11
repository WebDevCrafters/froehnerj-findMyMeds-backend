import mongoose, { Schema } from "mongoose";
import Payment from "../interfaces/schemaTypes/Payment";
import PaymentStatus from "../interfaces/schemaTypes/enums/PaymentStatus";

const PaymentSchema: Schema<Payment> = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    subscriptionId: {
        type: Schema.Types.ObjectId,
        ref: "Subscription",
        required: true,
    },
    status: {
        type: String,
        enum: Object.values(PaymentStatus),
        required: true,
    },
    paidOn: { type: Number },
});

export default mongoose.model<Payment>("Payment", PaymentSchema);
