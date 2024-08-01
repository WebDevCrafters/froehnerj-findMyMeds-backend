import { AuthEndpoints } from "../interfaces/endpoints/authEndpoints";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../interfaces/requests/AuthRequest";
import { AuthResponse } from "../interfaces/responses/AuthResponse";
import UserModel from "../models/UserModel";
import { User } from "../interfaces/schemaTypes/User";

class AuthController implements AuthEndpoints {
    public async signIn(req: AuthRequest, res: Response) {
        const {userId} = req.body
        const userFromDB: User | null = await UserModel.findById(userId);
        res.json(userFromDB);
    }
    signUp(req: AuthRequest, res: Response) {
        res.send("Hii i am sigup");
    }
}

export const authController = new AuthController();
