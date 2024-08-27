import { ClientSession, Document, Types } from "mongoose";
import Search from "../interfaces/schemaTypes/Search";
import SearchModel from "../models/SearchModel";
import { NotFoundError } from "../classes/errors/notFoundError";
import Medication from "../interfaces/schemaTypes/Medication";
import { SearchStatus } from "../interfaces/schemaTypes/enums/SearchStatus";
import UserModel from "../models/UserModel";
import userService from "./user.service";
import DBLocation from "../interfaces/schemaTypes/DBLocation";

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
        requestUserCoordinates: number[],
        radiusMiles: number
    ) {
        const radiusRadians = radiusMiles / 3963.2;

        const nearbySearches = await SearchModel.find({
            patient: { $ne: userId },
            status: SearchStatus.InProgress,
            location: {
                $geoWithin: {
                    $centerSphere: [requestUserCoordinates, radiusRadians],
                },
            },
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

        if (!nearbySearches || nearbySearches.length === 0) {
            throw new NotFoundError("No nearby searches found");
        }

        return nearbySearches.map((doc) => this.makeSearchFromDoc(doc));
    }

    async getSearch(searchId: string | Types.ObjectId): Promise<Search | null> {
        const search = await SearchModel.findById(searchId);
        if (!search) return null;
        return this.makeSearchFromDoc(search);
    }

    makeSearchFromDoc(
        searchDoc: Document<unknown, {}, Search> &
            Search & {
                _id: Types.ObjectId;
            }
    ): Search {
        let { _id, ...searchRes } = searchDoc.toObject();
        searchRes.searchId = _id;

        if (searchRes.medication) {
            let { _id, ...medication } = searchRes.medication as Medication & {
                _id: Types.ObjectId;
            };

            medication.medicationId = _id;
            searchRes.medication = medication;
        }

        if (searchRes.medication.alternatives?.length) {
            const formattedAlternatives = searchRes.medication.alternatives.map(
                (ele) => {
                    let { _id, ...alternative } = ele as Medication & {
                        _id: Types.ObjectId;
                    };
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
