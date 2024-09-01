import express from "express";
import notificationController from "../controllers/notificationController";
import { validateTokenHandler } from "../middleware/validateTokenHandler";
import asyncHandler from "../middleware/asyncHandler";

const notificationRouter = express.Router();

notificationRouter.use(validateTokenHandler)
notificationRouter.route("/").get(asyncHandler(notificationController.getNotifications));

export default notificationRouter;
