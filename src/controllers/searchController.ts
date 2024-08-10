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
import medicationService from "../services/medication.service";

class SearchController implements SearchEndpoints {
    async add(req: Request, res: Response) {
        const medication: Medication = req.body;
        if (!isMedication(medication))
            throw new BadRequestError("Invalid medication");

        const insertedAlternatives: Medication[] =
            await medicationService.insertMedicationBulk(
                medication.alternatives
            );

        const alternativesIds: Types.ObjectId[] = insertedAlternatives.map(
            (alternative) => alternative.medicationId
        );

        const medicationToAdd: Medication = {
            ...medication,
            alternatives: alternativesIds,
        };

        const newMedication = await medicationService.insertMedication(
            medicationToAdd
        );

        newMedication.alternatives = insertedAlternatives;

        res.json(newMedication);
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
