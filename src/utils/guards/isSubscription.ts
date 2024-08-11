import Subscription from "../../interfaces/schemaTypes/Subscription";

function isSubscription(object: any): object is Subscription {
    return (
        object &&
        typeof object === "object" &&
        "name" in object &&
        "cost" in object &&
        "searchCount" in object &&
        "status" in object
    );
}

export default isSubscription;
