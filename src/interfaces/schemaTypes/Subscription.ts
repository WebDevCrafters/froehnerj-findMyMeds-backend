import { Types } from "mongoose";
import SubscriptionStatus from "./enums/SubscriptionStatus";

interface Subscription {
    subscriptionId?: Types.ObjectId;
    name: string;
    cost: number;
    searchCount: number;
    status: SubscriptionStatus;
}

export default Subscription;
