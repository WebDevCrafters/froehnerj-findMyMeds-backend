
import { Request, Response } from 'express';

export interface UserEndpoints {
    signIn: (req: Request, res: Response) => void;
    signUp: (req: Request, res: Response) => void;
}