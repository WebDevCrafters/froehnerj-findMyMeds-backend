import { authController } from "../controllers/authController";
import express, { Request, Response } from "express";
import asyncHandler from "../middleware/asyncHandler";
import { validateUserType } from "../middleware/validateUserType";

const authRouter = express.Router();

authRouter.route("/signin").post(asyncHandler(authController.signIn));
authRouter
    .route("/signup")
    .post(validateUserType, asyncHandler(authController.signUp));

export default authRouter;
