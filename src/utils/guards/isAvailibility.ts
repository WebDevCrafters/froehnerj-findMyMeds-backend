import Availability from "../../interfaces/schemaTypes/Availability";
import Medication from "../../interfaces/schemaTypes/Medication";

function isAvailability(object: any): object is Availability {
    return (
        object &&
        typeof object === "object" &&
        "clinicianId" in object &&
        "search" in object
    );
}

export default isAvailability;
