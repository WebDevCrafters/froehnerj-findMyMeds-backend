import { Types } from "mongoose";

interface Subscription {
    subscriptionId: Types.ObjectId;
    name: string;
    cost: number;
    searchCount: number;
}

export default Subscription;
