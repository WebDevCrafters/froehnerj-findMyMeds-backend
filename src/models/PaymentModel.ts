import mongoose, { Schema, Document } from 'mongoose';
import { PaymentStatus } from '../interfaces/schemaTypes/enums/PaymentStatus';
import { Payment } from '../interfaces/schemaTypes/Payment';

const PaymentSchema: Schema = new Schema({
    paymentId: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    searchId: { type: String, required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: Object.values(PaymentStatus), required: true },
    paymentDate: { type: Date, required: true }
});

export default mongoose.model<Payment>('Payment', PaymentSchema);
