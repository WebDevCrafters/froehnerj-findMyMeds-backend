import { authController } from "../controllers/authController";
import express, { Request, Response } from 'express';

const authRouter = express.Router();

authRouter.route('/signin').get(authController.signIn)
authRouter.route('/signup').get(authController.signUp)

export default authRouter;

