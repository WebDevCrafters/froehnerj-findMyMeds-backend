import mongoose, { Schema } from "mongoose";
import Subscription from "../interfaces/schemaTypes/Subscription";
import SubscriptionStatus from "../interfaces/schemaTypes/enums/SubscriptionStatus";

const SubscriptionSchema: Schema<Subscription> = new Schema({
    name: { type: String, required: true },
    description: { type: String },
    cost: { type: Number, required: true },
    searchCount: { type: Number, required: true },
    status: {
        type: String,
        enum: Object.values(SubscriptionStatus),
        required: true,
    },
});

export default mongoose.model<Subscription>("Subscription", SubscriptionSchema);
