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

    async insertedMedication(medication: Medication): Promise<Medication> {
        const { name, pickUpDate } = medication;

        if (!name || !pickUpDate) throw new BadRequestError();

        const insertedMedication = await MedicationModel.create(medication);

        return insertedMedication;
    }

    async insertMedicationBulk(
        medications: (Types.ObjectId | Medication)[]
    ): Promise<Medication[]> {
        for (let medication of medications) {
            if (!isMedication(medication))
                throw new BadRequestError("Invalid alternative");
        }

        const newMedications = await MedicationModel.insertMany(medications);

        return newMedications.map((doc): Medication => {
            const { _id, __v, medicationId, ...rest } =
                doc.toObject() as Medication & {
                    __v?: number;
                    _id: Types.ObjectId;
                };

            return {
                medicationId: _id,
                ...rest,
            };
        });
    }
}

export const medicationController = new MedicationController();
