import Location from "../responses/Location";

interface DBLocation {
    type: "Point";
    coordinates: [number, number];
}

export function convertToLocation(dbLocation: DBLocation): Location {
    return {
        longitude: dbLocation.coordinates[0],
        latitude: dbLocation.coordinates[1],
    };
}

export default DBLocation;
