import { userController } from "../controllers/userController";
import express, { Request, Response } from "express";
import asyncHandler from "../middleware/asyncHandler";
import { validateUserType } from "../middleware/validateUserType";

const userRouter = express.Router();

userRouter.route("/signin").post(asyncHandler(userController.signIn));
userRouter
    .route("/signup")
    .post(validateUserType, asyncHandler(userController.signUp));
userRouter.route("/:id").get(asyncHandler(userController.getUser));

export default userRouter;
