
import { Request, Response } from 'express';
import { AuthResponse } from '../responses/AuthResponse';
import { AuthRequest } from '../requests/AuthRequest';

export interface AuthEndpoints {
    signIn: (req: Request, res: Response) => void;
    signUp: (req: Request, res: Response) => void;
}