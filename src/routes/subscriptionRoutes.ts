import express from "express";
import asyncHandler from "../middleware/asyncHandler";
import subscriptionController from "../controllers/subscriptionController";

const subscriptionRouter = express.Router();

subscriptionRouter
    .route("/")
    .get(asyncHandler(subscriptionController.getAllSubscriptions));

export default subscriptionRouter;
