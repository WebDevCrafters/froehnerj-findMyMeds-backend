
import { Request, Response } from 'express';
import { AuthResponse } from '../responses/AuthResponse';
import { AuthRequest } from '../requests/AuthRequest';

export interface AuthEndpoints {
    signIn: (req: AuthRequest, res: AuthResponse) => void;
    signUp: (req: AuthRequest, res: AuthResponse) => void;
}