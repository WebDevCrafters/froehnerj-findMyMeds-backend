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
        const amount = req.body?.amount;
        
        const session = await stripe.checkout.sessions.create({
            payment_method_types: [
                "card"
            ],
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: "Test payment",
                        },
                        unit_amount: amount,
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
        console.log("headers are-----",req.headers)
        const endpointSecret = process.env.WEBHOOK_SECRET;
    
        if (!sig || !endpointSecret) {
            console.log({sig}, {endpointSecret})
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
                // Execute your function here
                await this.handleSuccessfulPayment(session);
                break;
            default:
                console.log(`Unhandled event type ${event.type}`);
        }
    
        res.status(200).json({ received: true });
    };

    handleSuccessfulPayment = async (session: Stripe.Checkout.Session) => {
        // Your custom logic here, e.g., update user records, send notifications, etc.
        console.log('Eissa Payment succeeded:', session);
        // Perform additional actions like updating the database or notifying the user
    };
    
}

export default new PaymentController();
