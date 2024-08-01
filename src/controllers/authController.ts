import { AuthEndpoints } from "../interfaces/endpoints/authEndpoints";
import { Request, Response } from "express";
import jwt from 'jsonwebtoken'
import { AuthRequest } from "../interfaces/requests/AuthRequest";
import { AuthResponse } from "../interfaces/responses/AuthResponse";

class AuthController implements AuthEndpoints {
    signIn(req: AuthRequest, res: AuthResponse) {
        res.send("Hii i am sigin")
    }
    signUp(req: AuthRequest, res: AuthResponse) {
        res.send("Hii i am sigup")
    }
}

export const authController = new AuthController();
