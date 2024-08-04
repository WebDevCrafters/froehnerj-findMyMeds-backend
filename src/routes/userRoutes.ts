import { userController } from "../controllers/userController";
import express, { Request, Response } from "express";
import asyncHandler from "../middleware/asyncHandler";
import { validateUserType } from "../middleware/validateUserType";
import { validateTokenHandler } from "../middleware/validateTokenHandler";

const userRouter = express.Router();

userRouter.route("/signin").post(asyncHandler(userController.signIn));
userRouter
    .route("/signup")
    .post(validateUserType, asyncHandler(userController.signUp));
userRouter
    .route("/:id")
    .get(validateTokenHandler, asyncHandler(userController.getUser));
userRouter
    .route("/update")
    .put(validateTokenHandler, asyncHandler(userController.updateUser));

export default userRouter;
