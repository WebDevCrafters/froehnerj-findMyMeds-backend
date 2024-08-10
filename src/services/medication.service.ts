import { Types } from "mongoose";
import { BadRequestError } from "../classes/errors/badRequestError";
import Medication from "../interfaces/schemaTypes/Medication";
import MedicationModel from "../models/MedicationModel";
import isMedication from "../utils/guards/isMedication";

class MedicationService {
    async insertMedication(medication: Medication): Promise<Medication> {
        if (!isMedication(medication))
            throw new BadRequestError("Invalid medication");

        const insertedMedication = await MedicationModel.create(medication);
        const { _id, __v, medicationId, ...rest } =
            insertedMedication.toObject() as Medication & {
                __v?: number;
                _id: Types.ObjectId;
            };
        return {
            medicationId: _id,
            ...rest,
        };
    }

    async insertMedicationBulk(
        medications: (Types.ObjectId | Medication)[]
    ): Promise<Medication[]> {
        for (let medication of medications) {
            if (!isMedication(medication))
                throw new BadRequestError("Invalid medication");
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

export default new MedicationService();
