import mongoose, { Schema, Document } from 'mongoose';
import { SearchStatus } from '../interfaces/schemaTypes/enums/SearchStatus';
import { PaymentStatus } from '../interfaces/schemaTypes/enums/PaymentStatus';
import { Search } from '../interfaces/schemaTypes/Search';

const SearchSchema: Schema = new Schema({
    searchId: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    medications: { type: [String], required: true },
    packageId: { type: String, required: true },
    paymentStatus: { type: String, enum: Object.values(PaymentStatus), required: true },
    status: { type: String, enum: Object.values(SearchStatus), required: true }
});

export default mongoose.model<Search>('Search', SearchSchema);
