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
import Stripe from "stripe";
import dotenv from "dotenv";
import { ServerError } from "../classes/errors/serverError";
dotenv.config();

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

        const payment = await paymentService.getActivePaymentByUserId(
            user.userId
        );

        if (!payment) throw new NotFoundError();

        res.json(payment);
    }

    stripeSession = async (req: Request, res: Response) => {
        const sk = process.env.STRIPE_SK;
        if (!sk) throw new ServerError("Invalid SK for stripe");
        const stripe = new Stripe(sk);
        const subs = req.body as Subscription;
        
        const session = await stripe.checkout.sessions.create({
            payment_method_types: [
                "card"
            ],
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: subs.name,
                        },
                        unit_amount: subs.cost * 100,
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `${process.env.CLIENT_URL}/app/dashboard/payments`,
            cancel_url: `${process.env.CLIENT_URL}/app/dashboard/payments`,
            expand: ["payment_intent"],
        });

        return res.send(session);
    };

    handleWebhook = async (req: Request, res: Response) => {
        console.log("Handle webhook called")
        const sk = process.env.STRIPE_SK;
        if (!sk) throw new ServerError("Invalid SK for stripe");
        const stripe = new Stripe(sk);
        const sig = req.headers['stripe-signature'];
        const endpointSecret = process.env.WEBHOOK_SECRET;
    
        if (!sig || !endpointSecret) {
            return res.status(400).send('Webhook secret or signature missing.');
        }
    
        let event: Stripe.Event;
    
        try {
            event = stripe.webhooks.constructEvent(
                req.body,
                sig,
                endpointSecret
            );
        } catch (err) {
            return res.status(400).send(`Webhook Error: ${err}`);
        }
    
        switch (event.type) {
            case 'checkout.session.completed':
                const session = event.data.object as Stripe.Checkout.Session;
                await this.handleSuccessfulPayment(session);
                break;
            default:
                console.log(`Unhandled event type ${event.type}`);
        }
    
        res.status(200).json({ received: true });
    };

    handleSuccessfulPayment = async (session: Stripe.Checkout.Session) => {
        console.log('Eissa Payment succeeded:', session);
    };
    
}

export default new PaymentController();
