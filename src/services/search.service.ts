import { Types } from "mongoose";
import Search from "../interfaces/schemaTypes/Search";
import SearchModel from "../models/SearchModel";
import { NotFoundError } from "../classes/errors/notFoundError";
import Medication from "../interfaces/schemaTypes/Medication";

class SearchService {
    async insertSearch(search: Search): Promise<Search> {
        const newSearch = await SearchModel.create(search);
        const { _id, __v, ...rest } = newSearch.toObject() as Search & {
            __v?: number;
            _id: Types.ObjectId;
        };
        return {
            searchId: _id,
            ...rest,
        };
    }

    async getSearchByUserId(userId: Types.ObjectId) {
        const searches = await SearchModel.find({ patient: userId })
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
}

export default new SearchService();
