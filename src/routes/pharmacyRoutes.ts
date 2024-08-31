import express from "express";
import asyncHandler from "../middleware/asyncHandler";
import pharmacyController from "../controllers/pharmacyController";
import { validateTokenHandler } from "../middleware/validateTokenHandler";

const pharmacyRouter = express.Router();

pharmacyRouter.use(validateTokenHandler);
pharmacyRouter
    .route("/")
    .get(asyncHandler(pharmacyController.getPharmacyFaxesInRadius));
pharmacyRouter
    .route("/send")
    .post(asyncHandler(pharmacyController.sendInvitation));
pharmacyRouter
    .route("/check/:faxId")
    .get(asyncHandler(pharmacyController.checkStatus));

export default pharmacyRouter;
