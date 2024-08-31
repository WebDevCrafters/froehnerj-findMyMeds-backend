import { ClientSession, Types } from "mongoose";
import { BadRequestError } from "../classes/errors/badRequestError";
import Medication from "../interfaces/schemaTypes/Medication";
import MedicationModel from "../models/MedicationModel";
import isMedication from "../utils/guards/isMedication";
import { Document } from "mongoose";

class MedicationService {
    async insertMedication(
        medication: Medication,
        options?: { session?: ClientSession }
    ): Promise<Medication> {
        if (!isMedication(medication))
            throw new BadRequestError("Invalid medication");

        const insertedMedicationArr = await MedicationModel.create(
            [medication],
            { session: options?.session }
        );
        const insertedMedication = insertedMedicationArr[0];
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
        medications: (Types.ObjectId | Medication)[],
        options?: { session?: ClientSession }
    ): Promise<Medication[]> {
        for (let medication of medications) {
            if (!isMedication(medication))
                throw new BadRequestError("Invalid medication");
        }

        const newMedications = await MedicationModel.insertMany(medications, {
            session: options?.session,
        });

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

    async updateMedication(medication: Medication) {
        const updatedMedication = await MedicationModel.findByIdAndUpdate(
            medication.medicationId,
            medication,
            { new: true, runValidators: true }
        );

        if (!updatedMedication) return null;

        return this.mapToMedication(updatedMedication);
    }

    mapToMedication(
        medication: Document<unknown, {}, Medication> &
            Medication & {
                _id: Types.ObjectId;
            }
    ): Medication {
        let alternatives: Medication[] = medication.alternatives.map(
            (ele: Medication | Types.ObjectId) => {
                return {
                    medicationId: medication._id,
                    brandName: medication.brandName,
                    dose: medication.dose,
                    name: medication.name,
                    pickUpDate: medication.pickUpDate,
                    quantity: medication.quantity,
                    alternatives: [],
                };
            }
        );

        return {
            medicationId: medication._id,
            brandName: medication.brandName,
            dose: medication.dose,
            name: medication.name,
            pickUpDate: medication.pickUpDate,
            quantity: medication.quantity,
            alternatives: alternatives,
        };
    }
}

export default new MedicationService();
