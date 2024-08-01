import { AuthEndpoints } from "../interfaces/endpoints/authEndpoints";
import { Request, Response } from "express";

class AuthController implements AuthEndpoints {
    signIn(req: Request, res: Response) {
        res.send("Hii i am sigin")
    }
    signUp(req: Request, res: Response) {
        res.send("Hii i am sigup")
    }
}

export const authController = new AuthController();
