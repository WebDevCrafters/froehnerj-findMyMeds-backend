import Payment from "../../interfaces/schemaTypes/Payment";

function isPayment(object: any): object is Payment {
    return (
        object &&
        typeof object === "object" &&
        "userId" in object &&
        "subscription" in object
    );
}

export default isPayment;
