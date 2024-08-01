import { PatientEndpoints } from "../interfaces/endpoints/patientEndpoints";
import { Request, Response } from "express";

class PatientController implements PatientEndpoints {
    selectPackage(req: Request, res: Response): void {
        // Implementation of selecting package logic
    }

    payAmount(req: Request, res: Response): void {
        // Implementation of payment logic
    }
}

export const patientController = new PatientController();
