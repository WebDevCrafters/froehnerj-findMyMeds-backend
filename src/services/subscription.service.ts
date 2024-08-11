import SubscriptionStatus from "../interfaces/schemaTypes/enums/SubscriptionStatus";
import Subscription from "../interfaces/schemaTypes/Subscription";
import SubscriptionModel from "../models/SubscriptionModel";

class SubscriptionService {
    async insertSubscription(
        name: string,
        cost: number,
        searchCount: number,
        status: SubscriptionStatus
    ) {
        const subs: Subscription = {
            name,
            cost,
            searchCount,
            status,
        };
        const newSubs = await SubscriptionModel.create(subs);
        subs.subscriptionId = newSubs._id;
        return subs;
    }
}

export default new SubscriptionService();
