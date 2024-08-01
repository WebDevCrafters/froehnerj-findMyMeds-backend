import { authController } from "../controllers/authController";
import express, { Request, Response } from 'express';

const authRouter = express.Router();

authRouter.route('/signin').post(authController.signIn)
authRouter.route('/signup').post(authController.signUp)

export default authRouter;

