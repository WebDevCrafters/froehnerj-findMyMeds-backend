import mongoose, { Schema } from "mongoose";
import Subscription from "../interfaces/schemaTypes/Subscription";

const SubscriptionSchema: Schema<Subscription> = new Schema({
    name: { type: String, required: true },
    cost: { type: Number, required: true },
    searchCount: { type: Number, required: true },
});

export default mongoose.model<Subscription>("Subscription", SubscriptionSchema);
