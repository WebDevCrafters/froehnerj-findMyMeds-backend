import { Types } from "mongoose";
import Search from "../interfaces/schemaTypes/Search";
import SearchModel from "../models/SearchModel";

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
}

export default new SearchService();
