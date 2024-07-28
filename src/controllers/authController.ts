import { AuthEndpoints } from "../interfaces/authEndpoints";
import { Request, Response } from "express";

class AuthController implements AuthEndpoints {
    signIn(req: Request, res: Response) {
        //implement
    }
    signUp(req: Request, res: Response) {
        //implement
    }
}

export const authController = new AuthController();
