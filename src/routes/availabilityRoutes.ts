import express from "express";
import { validateTokenHandler } from "../middleware/validateTokenHandler";
import asyncHandler from "../middleware/asyncHandler";
import availabilityService from "../services/availability.service";
import availabilityController from "../controllers/availabilityController";

const availabilityRouter = express.Router();

availabilityRouter.use(validateTokenHandler);
availabilityRouter.route("/").post(asyncHandler(availabilityController.add));
availabilityRouter
    .route("/:id")
    .delete(asyncHandler(availabilityController.remove));
availabilityRouter
    .route("/:searchId")
    .get(asyncHandler(availabilityController.getAvailabilityBySearchId));
availabilityRouter
    .route("/check/:searchId")
    .get(asyncHandler(availabilityController.checkIfIMarked));

export default availabilityRouter;
