
import { Request, Response } from 'express';

export interface AuthEndpoints {
    signUp: (req: Request, res: Response) => void;
    signIn: (req: Request, res: Response) => void;
}