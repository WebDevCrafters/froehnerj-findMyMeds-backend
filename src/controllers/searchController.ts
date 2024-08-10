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
    async add(req: Request, res: Response) {}

    delete(req: Request, res: Response) {}

    getActive(req: Request, res: Response) {}

    getNearBy(req: Request, res: Response) {}

    getPrevious(req: Request, res: Response) {}

    markAsAvailable(req: Request, res: Response) {}

    markAsComplete(req: Request, res: Response) {}

    update(req: Request, res: Response) {}
}

export const searchController = new SearchController();
