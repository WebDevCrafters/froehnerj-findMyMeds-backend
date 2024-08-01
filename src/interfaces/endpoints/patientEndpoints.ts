
import { Request, Response } from 'express';

export interface PatientEndpoints {
    selectPackage: (req: Request, res: Response) => void;
    payAmount: (req: Request, res: Response) => void;
}
