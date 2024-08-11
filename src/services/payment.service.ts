import { Document, Types } from "mongoose";
import Payment from "../interfaces/schemaTypes/Payment";
import PaymentModel from "../models/PaymentModel";
import { NotFoundError } from "../classes/errors/notFoundError";
import subscriptionService from "./subscription.service";
import isValidObjectId from "../utils/guards/isValidObjectId";
import Subscription from "../interfaces/schemaTypes/Subscription";
import isPayment from "../utils/guards/isPayment";
import isSubscription from "../utils/guards/isSubscription";

class PyamentService {
    async insertPayment(payment: Payment): Promise<Payment> {
        const newPaymentDoc = await PaymentModel.create(payment);
        payment.paymentId = newPaymentDoc._id;
        return payment;
    }

    async updatePayment(payment: Payment) {
        const updatedPaymentDoc = await PaymentModel.findByIdAndUpdate(
            payment.paymentId,
            payment,
            { new: true, runValidators: true }
        );

        if (!updatedPaymentDoc) throw new NotFoundError();

        return this.makeDocToPayment(updatedPaymentDoc);
    }

    async getAllPaymentsByUserId(userId: Types.ObjectId) {
        const allPayments = await PaymentModel.find({ userId }).populate(
            "subscription"
        );

        const s = allPayments.map((doc) => this.makeDocToPayment(doc));
        return s;
    }

    makeDocToPayment(
        paymentDoc: Document<unknown, {}, Payment> &
            Payment & {
                _id: Types.ObjectId;
            }
    ): Payment {
        let subscription = paymentDoc.subscription;
        if (isSubscription(subscription)) {
            subscription = subscriptionService.makeDocToSubscription(
                subscription as Document<unknown, {}, Subscription> &
                    Subscription & {
                        _id: Types.ObjectId;
                    }
            );
        }

        return {
            subscription,
            userId: paymentDoc.userId,
            paidOn: paymentDoc.paidOn,
            paymentId: paymentDoc._id,
            status: paymentDoc.status,
        };
    }
}

export default new PyamentService();
