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

class SearchController implements SearchEndpoints {
    async add(req: Request, res: Response) {
        const session: ClientSession = await mongoose.startSession();
        session.startTransaction();
        try {
            const medication: Medication = req.body;
            const user: SecureUser = req.user;

            /**
                @todo: Check user payment 
            */

            if (!isMedication(medication))
                throw new BadRequestError("Invalid medication");

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
            };

            let searchResult = await searchService.insertSearch(newSearch, {
                session,
            });

            const prevPayment = await paymentService.getPaymentByUserId(
                user.userId
            );

            if (!prevPayment || prevPayment.status === PaymentStatus.UNPAID)
                throw new BadRequestError("User payment status is unpaid");

            let subscriptionId = null;

            if (isSubscription(prevPayment.subscription)) {
                subscriptionId = prevPayment.subscription.subscriptionId;
            }

            if (!subscriptionId)
                throw new BadRequestError("User does not have a subscriptoin");

            const updatePaymentReq: Payment = {
                ...prevPayment,
                subscription: subscriptionId,
                searchesConsumed: prevPayment.searchesConsumed + 1,
            };

            const newPayment = await paymentService.updatePayment(
                updatePaymentReq,
                { session }
            );

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
        const status = req.query.status as SearchStatus;

        const searchesRes = await searchService.getSearches(
            user.userId,
            status
        );

        res.json(searchesRes);
    }

    async getSearchInRedius(req: Request, res: Response) {
        const user = req.user;
        const searches = await searchService.getSearchesInRadius(
            user.userId,
            30,
            SearchStatus.InProgress
        );

        res.json(searches);
    }

    delete(req: Request, res: Response) {}

    getNearBy(req: Request, res: Response) {}

    markAsAvailable(req: Request, res: Response) {}

    markAsComplete(req: Request, res: Response) {}

    update(req: Request, res: Response) {}
}

export const searchController = new SearchController();
