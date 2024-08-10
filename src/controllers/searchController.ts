import { Request, Response } from "express";
import { BadRequestError } from "../classes/errors/badRequestError";
import SearchEndpoints from "../interfaces/endpoints/searchEndpoints";
import Medication from "../interfaces/schemaTypes/Medication";
import Search from "../interfaces/schemaTypes/Search";
import SearchModel from "../models/SearchModel";
import { medicationController } from "./MedicationController";
import { SearchStatus } from "../interfaces/schemaTypes/enums/SearchStatus";
import isMedication from "../utils/guards/isMedication";
import { Types } from "mongoose";

class SearchController implements SearchEndpoints {
    async add(req: Request, res: Response) {
        const medication: Medication = req.body as unknown as Medication;
        const { userId: userId } = req.user;
        if (!medication) throw new BadRequestError();

        let insertedAlternatives: Medication[] = [];
        let insertedAlternativesIds: Types.ObjectId[] = [];

        if (medication.alternatives) {
            for (let alternative of medication.alternatives) {
                if (!isMedication(alternative)) continue;

                const insertedAlternative =
                    await medicationController.insertedMedication(alternative);

                insertedAlternatives.push(insertedAlternative);
                insertedAlternativesIds.push(insertedAlternative._id);
            }

            medication.alternatives = insertedAlternativesIds;
        }

        const insertedMedication =
            await medicationController.insertedMedication(medication);
        const insertedMedicationId = insertedMedication._id;

        const searchDocument: Search = {
            medication: insertedMedicationId,
            patient: userId,
            status: SearchStatus.InProgress,
        };

        const newSearch = await SearchModel.create(searchDocument);

        const searchPopulated: Search = {
            ...newSearch,
            medication: insertedMedication,
            patient: userId,
        };

        res.json(searchPopulated);
    }

    delete(req: Request, res: Response) {}

    getActive(req: Request, res: Response) {}

    getNearBy(req: Request, res: Response) {}

    getPrevious(req: Request, res: Response) {}

    markAsAvailable(req: Request, res: Response) {}

    markAsComplete(req: Request, res: Response) {}

    update(req: Request, res: Response) {}
}

export const searchController = new SearchController();
