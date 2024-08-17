import Location from "../../interfaces/responses/Location";

function isLocation(object: any): object is Location {
    return (
        object &&
        typeof object === "object" &&
        "longitude" in object &&
        "latitude" in object
    );
}

export default isLocation;
