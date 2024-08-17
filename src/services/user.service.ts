import { Document, Types } from "mongoose";
import User from "../interfaces/schemaTypes/User";
import SecureUser from "../interfaces/responses/SecureUser";
import Location from "../interfaces/responses/Location";
import { BadRequestError } from "../classes/errors/badRequestError";
import dotenv from "dotenv";
dotenv.config();

class UserService {
    private GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

    makeDocToAvailibility(
        doc: Document<unknown, {}, SecureUser> &
            SecureUser & {
                _id: Types.ObjectId;
            }
    ) {
        const { _id, __v, userId, password, ...rest } =
            doc.toObject() as SecureUser & {
                _id: Types.ObjectId;
                __v: number;
                password: string;
            };
        return {
            userId: _id,
            ...rest,
        };
    }

    async getUserCoordinates(zipCode: number): Promise<Location> {
        try {
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?address=${zipCode}&key=${this.GOOGLE_MAPS_API_KEY}`
            );

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const data = await response.json();

            if (data.status === "OK") {
                const location = data.results[0].geometry.location;
                return {
                    latitude: location.lat,
                    longitude: location.lng,
                };
            } else {
                throw new BadRequestError(`Geocoding failed with status: ${data.status}`);
            }
        } catch (error) {
            throw new BadRequestError(
                "Unable to get coordinates for the provided zip code."
            );
        }
    }
}

export default new UserService();
