import { Request, Response } from "express";
import { ClinicianEndpoints } from "../interfaces/clinicianEndpoints";

class ClinicianController implements ClinicianEndpoints {
    getPatientsList(req: Request, res: Response): void {
        // Implementation of getting patients list logic
    }
}

export const clinicianController = new ClinicianController();
