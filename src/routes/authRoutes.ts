import { authController } from "../controllers/authController";
import express, { Request, Response } from 'express';
import asyncHandler from "../middleware/asyncHandler";

const authRouter = express.Router();

authRouter.route('/signin').post(asyncHandler(authController.signIn))
authRouter.route('/signup').post(asyncHandler(authController.signUp))

export default authRouter;

