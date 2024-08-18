import { ClientSession, Types } from "mongoose";
import Search from "../interfaces/schemaTypes/Search";
import SearchModel from "../models/SearchModel";
import { NotFoundError } from "../classes/errors/notFoundError";
import Medication from "../interfaces/schemaTypes/Medication";
import { SearchStatus } from "../interfaces/schemaTypes/enums/SearchStatus";
import UserModel from "../models/UserModel";

class SearchService {
    async insertSearch(
        search: Search,
        options?: { session?: ClientSession }
    ): Promise<Search> {
        const newSearchArr = await SearchModel.create([search], {
            session: options?.session,
        });
        const newSearch = newSearchArr[0];
        const { _id, __v, ...rest } = newSearch.toObject() as Search & {
            __v?: number;
            _id: Types.ObjectId;
        };
        return {
            searchId: _id,
            ...rest,
        };
    }

    async getSearches(userId: Types.ObjectId, status: SearchStatus) {
        const searches = await SearchModel.find({
            patient: userId,
            status: status,
        })
            .select("-__v")
            .populate({
                path: "medication",
                select: "-__v",
                populate: {
                    path: "alternatives",
                    model: "Medication",
                    select: "-__v",
                },
            });

        if (!searches) throw new NotFoundError();

        const searchArrResult = searches.map((search) => {
            let { _id, ...searchRes } = search.toObject();
            searchRes.searchId = _id;

            if (searchRes.medication) {
                let { _id, ...medication } =
                    searchRes.medication as Medication & {
                        _id: Types.ObjectId;
                    };

                medication.medicationId = _id;
                searchRes.medication = medication;
            }

            if (searchRes.medication.alternatives?.length) {
                const formattedAlternatives =
                    searchRes.medication.alternatives.map((ele) => {
                        let { _id, ...alternative } = ele as Medication & {
                            _id: Types.ObjectId;
                        };
                        alternative.medicationId = _id;
                        return alternative;
                    });
                searchRes.medication.alternatives = formattedAlternatives;
            }

            /**
                @todo: Send status also 
            */

            return searchRes;
        });

        return searchArrResult;
    }

    async getSearchesInRadius(
        userId: Types.ObjectId,
        radiusMiles: number,
        status: SearchStatus
    ) {
        const requestingUser = await UserModel.findById(userId).select(
            "location"
        );
        if (!requestingUser || !requestingUser.location) {
            throw new NotFoundError("User location not found");
        }

        const radiusRadians = radiusMiles / 3963.2; // Convert miles to radians (Earth's radius in miles)

        // Find users within the 30-mile radius of the requesting user
        const nearbyUsers = await UserModel.find({
            _id:{$ne: userId},
            location: {
                $geoWithin: {
                    $centerSphere: [
                        requestingUser.location.coordinates,
                        radiusRadians,
                    ],
                },
            },
        }).select("_id");

        if (!nearbyUsers || nearbyUsers.length === 0) {
            throw new NotFoundError("No nearby users found");
        }

        // Extract user IDs of the nearby users
        const nearbyUserIds = nearbyUsers.map((user) => user._id);

        // Find searches related to these users
        const searches = await SearchModel.find({
            patient: { $in: nearbyUserIds },
            status: status,
        })
            .select("-__v")
            .populate({
                path: "medication",
                select: "-__v",
                populate: {
                    path: "alternatives",
                    model: "Medication",
                    select: "-__v",
                },
            });

        if (!searches || searches.length === 0)
            throw new NotFoundError("No searches found");

        const searchArrResult = searches.map((search) => {
            let { _id, ...searchRes } = search.toObject();
            searchRes.searchId = _id;

            if (searchRes.medication) {
                let { _id, ...medication } =
                    searchRes.medication as Medication & {
                        _id: Types.ObjectId;
                    };

                medication.medicationId = _id;
                searchRes.medication = medication;
            }

            if (searchRes.medication.alternatives?.length) {
                const formattedAlternatives =
                    searchRes.medication.alternatives.map((ele) => {
                        let { _id, ...alternative } = ele as Medication & {
                            _id: Types.ObjectId;
                        };
                        alternative.medicationId = _id;
                        return alternative;
                    });
                searchRes.medication.alternatives = formattedAlternatives;
            }

            /**
                @todo: Send status also 
            */

            return searchRes;
        });

        return searchArrResult;
    }
}

export default new SearchService();
