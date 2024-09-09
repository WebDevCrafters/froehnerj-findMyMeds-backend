import { Request, Response } from "express";
import { BadRequestError } from "../classes/errors/badRequestError";
import PaymentsEndpoints from "../interfaces/endpoints/paymentEndpoints";
import paymentService from "../services/payment.service";
import isPayment from "../utils/guards/isPayment";
import { isValidObjectId, Types } from "mongoose";
import Payment from "../interfaces/schemaTypes/Payment";
import { NotFoundError } from "../classes/errors/notFoundError";
import { ForbiddenError } from "../classes/errors/forbiddenError";
import Subscription from "../interfaces/schemaTypes/Subscription";
import subscriptionService from "../services/subscription.service";
import { PaymentRequiredError } from "../classes/errors/paymentRequiredError";

class PaymentController implements PaymentsEndpoints {
    async addPayment(req: Request, res: Response): Promise<void> {
        const payment = req.body;
        const user = req.user;
        payment.userId = user.userId;
        payment.searchesConsumed = 0;
        // payment.paidOn = Date.now();

        if (!isPayment(payment)) throw new BadRequestError();

        if (
            !isValidObjectId(payment.userId) ||
            !isValidObjectId(payment.subscription)
        )
            throw new BadRequestError("Invalid ObjectId");

        const subscription = payment.subscription as Types.ObjectId;
        const subscriptionObj: Subscription | null =
            await subscriptionService.getSubscriptionById(subscription);
        if (!subscriptionObj)
            throw new BadRequestError("Subscription does not exist.");

        const newPayment = await paymentService.insertPayment(payment);
        newPayment.subscription = subscriptionObj;
        res.json(newPayment);
    }

    async updatePayment(req: Request, res: Response) {
        const payment = req.body as Payment;

        if (!payment?.paymentId || !isValidObjectId(payment.paymentId))
            throw new BadRequestError("Invalid paymentId");

        /**
            @todo: check if subscription exists 
            @todo: verify valid payment status
         */
        const updatedPayment = await paymentService.updatePayment(payment);

        res.json(updatedPayment);
    }

    async getAllPayments(req: Request, res: Response) {
        const user = req.user;

        if (!isValidObjectId(user.userId))
            throw new ForbiddenError("Invalid access token user");

        const payments = await paymentService.getAllPaymentsByUserId(
            user.userId
        );

        if (!payments || !payments.length) throw new NotFoundError();

        res.json(payments);
    }

    async getActivePayment(req: Request, res: Response) {
        const user = req.user;

        if (!isValidObjectId(user.userId))
            throw new ForbiddenError("Invalid access token user");

        const payment = await paymentService.getActivePaymentByUserId(user.userId);

        if (!payment) throw new NotFoundError();

        res.json(payment);
    }
}

export default new PaymentController();
