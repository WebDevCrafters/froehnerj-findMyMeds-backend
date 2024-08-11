import { Request, Response } from "express";

interface SubscriptionEndpoints {
    getAllSubscriptions: (req: Request, res: Response) => void;
}

export default SubscriptionEndpoints;
