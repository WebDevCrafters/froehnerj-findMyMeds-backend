
import { Request, Response } from 'express';

export interface ClinicianEndpoints {
    getPatientsList: (req: Request, res: Response) => void;
}
