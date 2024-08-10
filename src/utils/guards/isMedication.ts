import Medication from "../../interfaces/schemaTypes/Medication";

function isMedication(object: any): object is Medication {
    return (
        object &&
        typeof object === "object" &&
        "_id" in object &&
        "name" in object &&
        "dose" in object &&
        "quantity" in object &&
        "pickUpDate" in object
    );
}

export default isMedication;
