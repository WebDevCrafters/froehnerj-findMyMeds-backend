import SubscriptionStatus from "../interfaces/schemaTypes/enums/SubscriptionStatus";
import Subscription from "../interfaces/schemaTypes/Subscription";

const defaultSubscriptions: Subscription[] = [
    {
        name: "One Med Search",
        cost: 20,
        searchCount: 1,
        description: "Get a full refund if we don't find your medication!",
        status: SubscriptionStatus.Active,
    },
    {
        name: "Three Med Searches",
        cost: 40,
        searchCount: 3,
        description:
            "Most popular package. Use remaining searches anytime in the future for any medications.",
        status: SubscriptionStatus.Active,
    },
    {
        name: "Six Med Searches",
        cost: 60,
        searchCount: 6,
        description:
            "Best value! Use remaining searches any time in the future, for any medication.",
        status: SubscriptionStatus.Active,
    },
];

export default defaultSubscriptions;
