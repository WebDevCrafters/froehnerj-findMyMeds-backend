import express from "express";
import asyncHandler from "../middleware/asyncHandler";
import paymentController from "../controllers/paymentController";
import { validateTokenHandler } from "../middleware/validateTokenHandler";

const paymentRouter = express.Router();

paymentRouter.route("/").post(validateTokenHandler, asyncHandler(paymentController.addPayment));
paymentRouter.route("/").put(validateTokenHandler, asyncHandler(paymentController.updatePayment));
paymentRouter.route("/all").get(validateTokenHandler, asyncHandler(paymentController.getAllPayments));
paymentRouter.route("/").get(validateTokenHandler, asyncHandler(paymentController.getActivePayment));
paymentRouter.route("/stripe").post(validateTokenHandler, asyncHandler(paymentController.stripeSession));
paymentRouter.route("/webhook").post(asyncHandler(paymentController.handleWebhook));

export default paymentRouter;
