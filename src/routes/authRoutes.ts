import { authController } from "../controllers/authController";
import express, { Request, Response } from 'express';

const authRoutes = express.Router();

authRoutes.route('/signin').get(authController.signIn)
authRoutes.route('/signup').get(authController.signUp)

export default authRoutes;

