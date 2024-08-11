import { Request, Response } from "express";
import SubscriptionEndpoints from "../interfaces/endpoints/subscriptionEndpoints";
import subscriptionService from "../services/subscription.service";
import { NotFoundError } from "../classes/errors/notFoundError";

class SubscriptionController implements SubscriptionEndpoints {
    async getAllSubscriptions(req: Request, res: Response) {
        const allSUbscriptions =
            await subscriptionService.getAllSubscriptions();
        if (!allSUbscriptions.length) throw new NotFoundError();
        res.json(allSUbscriptions);
    }
}

export default new SubscriptionController();
