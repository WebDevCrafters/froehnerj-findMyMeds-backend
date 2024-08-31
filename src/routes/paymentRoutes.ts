import express from "express";
import asyncHandler from "../middleware/asyncHandler";
import paymentController from "../controllers/paymentController";
import { validateTokenHandler } from "../middleware/validateTokenHandler";

const paymentRouter = express.Router();

paymentRouter.use(validateTokenHandler);
paymentRouter.route("/").post(asyncHandler(paymentController.addPayment));
paymentRouter.route("/").put(asyncHandler(paymentController.updatePayment));
paymentRouter.route("/all").get(asyncHandler(paymentController.getAllPayments));
paymentRouter.route("/").get(asyncHandler(paymentController.getActivePayment));

export default paymentRouter;
