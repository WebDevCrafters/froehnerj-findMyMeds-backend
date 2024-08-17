import DBLocation from "../schemaTypes/DBLocation";

interface Location {
    longitude: number;
    latitude: number;
}

export function convertToDBLocation(location: Location): DBLocation {
    return {
        type: "Point",
        coordinates: [location.longitude, location.latitude],
    };
}

export default Location;
