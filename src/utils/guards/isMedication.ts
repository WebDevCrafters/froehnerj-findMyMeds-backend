import Medication from "../../interfaces/schemaTypes/Medication";

function isMedication(object: any): object is Medication {
    return (
        object &&
        typeof object === "object" &&
        "name" in object &&
        "pickUpDate" in object
    );
}

export default isMedication;
