import { Request, Response } from "express";

export interface UserEndpoints {
    signIn: (req: Request, res: Response) => void;
    signUp: (req: Request, res: Response) => void;
    updateUser: (req: Request, res: Response) => void;
    getUser: (req: Request, res: Response) => void;
}
