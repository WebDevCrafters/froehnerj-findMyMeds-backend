import { BadRequestError } from "../classes/errors/badRequestError";
import MedicationEndpoints from "../interfaces/endpoints/medicationEndpoints";
import Medication from "../interfaces/schemaTypes/Medication";
import MedicationModel from "../models/MedicationModel";

class MedicationController implements MedicationEndpoints {
    add(req: Request, res: Response) {}
    delete(req: Request, res: Response) {}
    update(req: Request, res: Response) {}

    async insertedMedication(medication: Medication): Promise<Medication> {
        const { name, pickUpDate } = medication;

        if (!name || !pickUpDate) throw new BadRequestError();

        const insertedMedication = await MedicationModel.create(medication);

        return insertedMedication;
    }
}

export const medicationController = new MedicationController();
