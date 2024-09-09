import Availability from "../../interfaces/schemaTypes/Availability";
import Medication from "../../interfaces/schemaTypes/Medication";

function isAvailability(object: any): object is Availability {
    return (
        object &&
        typeof object === "object" &&
        "clinician" in object &&
        "search" in object &&
        "markedOn" in object 
    );
}

export default isAvailability;
