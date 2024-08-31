import { Request, Response } from "express";
import { BadRequestError } from "../classes/errors/badRequestError";
import SearchEndpoints from "../interfaces/endpoints/searchEndpoints";
import Medication from "../interfaces/schemaTypes/Medication";
import Search from "../interfaces/schemaTypes/Search";
import SearchModel from "../models/SearchModel";
import { medicationController } from "./MedicationController";
import { SearchStatus } from "../interfaces/schemaTypes/enums/SearchStatus";
import isMedication from "../utils/guards/isMedication";
import mongoose, { ClientSession, Types } from "mongoose";
import medicationService from "../services/medication.service";
import searchService from "../services/search.service";
import SecureUser from "../interfaces/responses/SecureUser";
import paymentService from "../services/payment.service";
import Payment from "../interfaces/schemaTypes/Payment";
import { ServerError } from "../classes/errors/serverError";
import PaymentStatus from "../interfaces/schemaTypes/enums/PaymentStatus";
import isSubscription from "../utils/guards/isSubscription";
import { convertToDBLocation } from "../interfaces/responses/Location";
import isLocation from "../utils/guards/isLocation";
import userService from "../services/user.service";
import { NotFoundError } from "../classes/errors/notFoundError";

class SearchController implements SearchEndpoints {
    async add(req: Request, res: Response) {
        const session: ClientSession = await mongoose.startSession();
        session.startTransaction();
        try {
            const search: Search = req.body;
            const user: SecureUser = req.user;
            const medication = search.medication;

            if (!search.zipCode) throw new BadRequestError("Invalid zipCode");

            if (!isMedication(medication))
                throw new BadRequestError("Invalid medication");

            if (!medication.alternatives) medication.alternatives = [];

            const prevPayment = await paymentService.getActivePaymentByUserId(
                user.userId
            );

            const insertedAlternatives: Medication[] =
                await medicationService.insertMedicationBulk(
                    medication.alternatives,
                    { session }
                );

            const alternativesIds: Types.ObjectId[] = insertedAlternatives.map(
                (alternative) => alternative.medicationId
            );

            const medicationToAdd: Medication = {
                ...medication,
                alternatives: alternativesIds,
            };

            if (!isLocation(search.location))
                search.location = await userService.getCoordinates(
                    search.zipCode
                );

            const location = convertToDBLocation(search.location);

            const newMedication = await medicationService.insertMedication(
                medicationToAdd,
                { session }
            );

            newMedication.alternatives = insertedAlternatives;

            /** 
                @todo: Search status according to payment status
            **/

            let newSearch: Search = {
                medication: newMedication.medicationId,
                patient: user.userId,
                status: SearchStatus.InProgress,
                location: location,
                prescriberName: search.prescriberName,
                zipCode: search.zipCode,
                dob: search.dob,
            };

            if (!prevPayment || prevPayment.status === PaymentStatus.UNPAID)
                newSearch.status = SearchStatus.NotStarted;

            let searchResult = await searchService.insertSearch(newSearch, {
                session,
            });

            /**
                @todo: different function increse searchConsumed
             */

            let subscriptionId = null;

            if (prevPayment && prevPayment.status !== PaymentStatus.UNPAID) {
                if (isSubscription(prevPayment.subscription)) {
                    subscriptionId = prevPayment.subscription.subscriptionId;
                }

                if (!subscriptionId)
                    throw new BadRequestError("Subscriptoin does not exist");

                const updatePaymentReq: Payment = {
                    ...prevPayment,
                    subscription: subscriptionId,
                    searchesConsumed: prevPayment.searchesConsumed + 1,
                };

                const newPayment = await paymentService.updatePayment(
                    updatePaymentReq,
                    { session }
                );
            }

            searchResult.medication = newMedication;
            await session.commitTransaction();

            res.json(searchResult);
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }

    async getMySearches(req: Request, res: Response) {
        const user = req.user;
        const status = req.query.status as SearchStatus[];

        const searchesRes = await searchService.getSearchesBulk(
            user.userId,
            status
        );

        res.json(searchesRes);
    }

    async getSearchInRadius(req: Request, res: Response) {
        const user = req.user;

        const userFromDB = await userService.getSecureUser(user.userId);

        if (!userFromDB) throw new BadRequestError("Invalid access token");

        const dBLocation = convertToDBLocation(userFromDB.location);

        /**
            @todo: get 30 from client
         */

        const searches = await searchService.getSearchesInRadius(
            user.userId,
            dBLocation,
            30
        );

        res.json(searches);
    }

    async getSearch(req: Request, res: Response) {
        const searchId = req.params.searchId;
        const search = await searchService.getSearch(searchId);
        if (!search) throw new NotFoundError();

        res.json(search);
    }

    async getMarkedByMeSearches(req: Request, res: Response) {
        const userId = req.user.userId;
        const searches = await searchService.getMarkedByMeSearches(userId);
        if (!searches || !searches.length) throw new NotFoundError();

        res.json(searches);
    }

    async update(req: Request, res: Response) {
        const session: ClientSession = await mongoose.startSession();
        session.startTransaction();
        try {
            const search = req.body as Search;
            const medication = search.medication;

            if (!search.zipCode) throw new BadRequestError("Invalid zipCode");

            if (!isMedication(medication))
                throw new BadRequestError("Invalid medication");

            if (!medication.alternatives) medication.alternatives = [];

            const updatedMedication = await medicationService.updateMedication(
                medication
            );

            const location = await userService.getCoordinates(search.zipCode);
            search.medication = medication.medicationId;
            search.location = convertToDBLocation(location);

            const updatedSearch = await searchService.updateSearch(search);

            const searchRes = {
                ...updatedSearch,
                medication: updatedMedication,
                location: location,
            };
            await session.commitTransaction();
            res.json(searchRes);
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }

    delete(req: Request, res: Response) {}

    getNearBy(req: Request, res: Response) {}

    markAsAvailable(req: Request, res: Response) {}

    markAsComplete(req: Request, res: Response) {}
}

export const searchController = new SearchController();
