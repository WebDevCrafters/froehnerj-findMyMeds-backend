import mongoose, { ClientSession, Document, Types } from "mongoose";
import Search from "../interfaces/schemaTypes/Search";
import SearchModel from "../models/SearchModel";
import { NotFoundError } from "../classes/errors/notFoundError";
import Medication from "../interfaces/schemaTypes/Medication";
import { SearchStatus } from "../interfaces/schemaTypes/enums/SearchStatus";
import UserModel from "../models/UserModel";
import userService from "./user.service";
import DBLocation from "../interfaces/schemaTypes/DBLocation";
import Availability from "../interfaces/schemaTypes/Availability";

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

    async getSearchesBulk(userId: Types.ObjectId, status: SearchStatus) {
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

        const searchArrResult = searches.map((search) =>
            this.makeSearchFromDoc(search)
        );

        return searchArrResult;
    }

    async getSearchesInRadius(
        userId: string | Types.ObjectId,
        requestUserCoordinates: DBLocation,
        radiusMiles: number
    ) {
        const radiusMeters = radiusMiles * 1609.34;
        const radiusRadians = radiusMiles / 3963.2;
        requestUserCoordinates.type = "Point";
        const nearbySearchesAgg = await SearchModel.aggregate([
            {
                $geoNear: {
                    near: requestUserCoordinates,
                    distanceField: "dist.calculated",
                    maxDistance: radiusMeters,
                    query: {
                        status: SearchStatus.InProgress,
                        patient: { $ne: userId },
                    },
                    spherical: true,
                },
            },
            {
                $lookup: {
                    from: "medications",
                    foreignField: "_id",
                    localField: "medication",
                    as: "medication",
                },
            },
            {
                $unwind: "$medication",
            },
            {
                $lookup: {
                    from: "medications",
                    foreignField: "_id",
                    localField: "medication.alternatives",
                    as: "medication.alternatives",
                },
            },
            {
                $lookup: {
                    from: "availabilities",
                    localField: "_id",
                    foreignField: "search",
                    as: "availability",
                },
            },
            {
                $match: {
                    "availability.clinician": {
                        $ne: new Types.ObjectId(userId),
                    },
                },
            },
            {
                $unset: "availability",
            },
        ]);

        if (!nearbySearchesAgg || nearbySearchesAgg.length === 0) {
            throw new NotFoundError("No nearby searches found");
        }

        return nearbySearchesAgg.map((doc) => this.makeSearchFromDoc(doc));
    }

    async getSearch(searchId: string | Types.ObjectId): Promise<Search | null> {
        const search = await SearchModel.findById(searchId);
        if (!search) return null;
        return this.makeSearchFromDoc(search);
    }

    async getMarkedByMeSearches(userId: string | Types.ObjectId) {
        const searches = await SearchModel.aggregate([
            {
                $lookup: {
                    from: "medications",
                    foreignField: "_id",
                    localField: "medication",
                    as: "medication",
                },
            },
            {
                $unwind: "$medication",
            },
            {
                $lookup: {
                    from: "medications",
                    foreignField: "_id",
                    localField: "medication.alternatives",
                    as: "medication.alternatives",
                },
            },
            {
                $lookup: {
                    from: "availabilities",
                    localField: "_id",
                    foreignField: "search",
                    as: "availability",
                },
            },
            {
                $match: {
                    "availability.clinician": new Types.ObjectId(userId),
                },
            },
        ]);
        return searches.map((search) => this.makeSearchFromDoc(search));
    }

    makeSearchFromDoc(
        searchDoc: Document<unknown, {}, Search> &
            Search & {
                _id: Types.ObjectId;
            }
    ): Search {
        let searchObj = null;
        if (searchDoc instanceof Document) {
            searchObj = searchDoc.toObject();
        } else {
            searchObj = searchDoc;
        }
        let { _id, __v, ...searchRes } = searchObj;
        searchRes.searchId = _id;

        if (searchRes.medication) {
            let { _id, ...medication } = searchRes.medication as Medication & {
                _id: Types.ObjectId;
            };

            medication.medicationId = _id;
            searchRes.medication = medication;
        }

        if (searchRes.availability?.length) {
            const formattedAvailability = searchRes.availability.map(
                (
                    ele: Availability & {
                        _id: Types.ObjectId;
                        __v?: number;
                    }
                ) => {
                    let { _id, __v, ...availability } = ele;
                    availability.availabilityId = _id;
                    return availability;
                }
            );
            searchRes.availability = formattedAvailability;
        }

        if (searchRes.medication.alternatives?.length) {
            const formattedAlternatives = searchRes.medication.alternatives.map(
                (
                    ele: Medication & {
                        _id: Types.ObjectId;
                    }
                ) => {
                    let { _id, ...alternative } = ele;
                    alternative.medicationId = _id;
                    return alternative;
                }
            );
            searchRes.medication.alternatives = formattedAlternatives;
        }

        /**
                @todo: Send status also 
            */

        return searchRes;
    }
}

export default new SearchService();
