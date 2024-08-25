import mongoose, { Document, Types } from "mongoose";
import User from "../interfaces/schemaTypes/User";
import SecureUser from "../interfaces/responses/SecureUser";
import Location from "../interfaces/responses/Location";
import { BadRequestError } from "../classes/errors/badRequestError";
import dotenv from "dotenv";
import { ServerError } from "../classes/errors/serverError";
import UserModel from "../models/UserModel";
import { NotFoundError } from "../classes/errors/notFoundError";
import { convertToLocation } from "../interfaces/schemaTypes/DBLocation";
dotenv.config();

class UserService {
    private GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

    public async getSecureUser(
        idetifier: Types.ObjectId | string
    ): Promise<SecureUser | null> {
        let userFromDB = null;
        if (mongoose.isValidObjectId(idetifier)) {
            userFromDB = await UserModel.findById(idetifier);
        } else {
            userFromDB = await UserModel.findOne({ email: idetifier });
        }

        if (!userFromDB) return null;
        const location = convertToLocation(userFromDB.location);
        const userResponse: SecureUser = {
            userId: userFromDB._id,
            email: userFromDB.email,
            phoneNumber: userFromDB.phoneNumber,
            name: userFromDB.name,
            userType: userFromDB.userType,
            dob: userFromDB.dob,
            doctorId: userFromDB.doctorId,
            location: location,
            zipCode: userFromDB.zipCode,
        };

        return userResponse;
    }

    async getUser(email: string): Promise<User | null> {
        const userFromDB = await UserModel.findOne({
            email,
        });

        if (!userFromDB) return null;

        return userFromDB;
    }

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

    async getCoordinates(zipCode: number): Promise<Location> {
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
                throw new ServerError(
                    `Geocoding failed with status: ${data.status}`
                );
            }
        } catch (error) {
            throw new BadRequestError(
                "Unable to get coordinates for the provided zip code."
            );
        }
    }

    async getUserIdsWithinRadius(
        userId: Types.ObjectId,
        requestUserCoordinates: number[],
        radiusMiles: number
    ) {
        const radiusRadians = radiusMiles / 3963.2; // Convert miles to radians (Earth's radius in miles)

        // Find users within the 30-mile radius of the requesting user
        const nearbyUsers = await UserModel.find({
            _id: { $ne: userId },
            location: {
                $geoWithin: {
                    $centerSphere: [requestUserCoordinates, radiusRadians],
                },
            },
        }).select("_id");

        if (!nearbyUsers || nearbyUsers.length === 0) {
            throw new NotFoundError("No nearby users found");
        }

        // Extract user IDs of the nearby users
        const nearbyUserIds = nearbyUsers.map((user) => user._id);

        return nearbyUserIds;
    }
}

export default new UserService();
