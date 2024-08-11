import SubscriptionStatus from "../interfaces/schemaTypes/enums/SubscriptionStatus";

const defaultSubscriptions = [
    {
        name: "Basic Plan",
        cost: 10.0,
        searchCount: 50,
        status: SubscriptionStatus.Active,
    },
    {
        name: "Standard Plan",
        cost: 20.0,
        searchCount: 100,
        status: SubscriptionStatus.Active,
    },
    {
        name: "Premium Plan",
        cost: 30.0,
        searchCount: 200,
        status: SubscriptionStatus.Active,
    },
];

export default defaultSubscriptions;
