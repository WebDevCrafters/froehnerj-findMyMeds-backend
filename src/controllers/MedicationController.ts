import { Types } from "mongoose";
import { BadRequestError } from "../classes/errors/badRequestError";
import MedicationEndpoints from "../interfaces/endpoints/medicationEndpoints";
import Medication from "../interfaces/schemaTypes/Medication";
import MedicationModel from "../models/MedicationModel";
import isMedication from "../utils/guards/isMedication";

class MedicationController implements MedicationEndpoints {
    add(req: Request, res: Response) {}
    delete(req: Request, res: Response) {}
    update(req: Request, res: Response) {}


}

export const medicationController = new MedicationController();
