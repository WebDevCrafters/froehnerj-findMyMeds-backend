import { Document, Types } from "mongoose";
import SubscriptionStatus from "../interfaces/schemaTypes/enums/SubscriptionStatus";
import Subscription from "../interfaces/schemaTypes/Subscription";
import SubscriptionModel from "../models/SubscriptionModel";

class SubscriptionService {
    async insertSubscription(
        name: string,
        cost: number,
        searchCount: number,
        status: SubscriptionStatus
    ): Promise<Subscription> {
        const subs: Subscription = {
            name,
            cost,
            searchCount,
            status,
        };
        const newSubs = await SubscriptionModel.create(subs);
        subs.subscriptionId = newSubs._id;
        return subs;
    }

    async bulkInsertSubscriptions(
        subscriptions: Omit<Subscription, "subscriptionId">[]
    ) {
        try {
            const result = await SubscriptionModel.insertMany(subscriptions);
            return result.map((doc) => this.parseSubscription(doc));
        } catch (error) {
            console.error("An error occurred during bulk insertion:", error);
            throw error;
        }
    }

    async getAllSubscriptions(): Promise<Subscription[]> {
        try {
            const subscriptionDocs = await SubscriptionModel.find().exec();
            return subscriptionDocs.map((doc) => this.parseSubscription(doc));
        } catch (error) {
            throw new Error("Failed to retrieve subscriptions: " + error);
        }
    }

    async getSubscriptionById(id: string): Promise<Subscription | null> {
        try {
            const subscriptionDoc = await SubscriptionModel.findById(id).exec();
            if (!subscriptionDoc) {
                throw new Error(`Subscription with ID ${id} not found`);
            }
            return this.parseSubscription(subscriptionDoc);
        } catch (error) {
            throw new Error("Failed to retrieve subscription: " + error);
        }
    }

    async updateSubscription(
        id: string,
        updates: Partial<Subscription>
    ): Promise<Subscription | null> {
        try {
            const updatedDoc = await SubscriptionModel.findByIdAndUpdate(
                id,
                updates,
                { new: true }
            ).exec();
            if (!updatedDoc) {
                throw new Error(`Subscription with ID ${id} not found`);
            }
            return this.parseSubscription(updatedDoc);
        } catch (error) {
            throw new Error("Failed to update subscription: " + error);
        }
    }

    async deleteSubscription(id: string): Promise<void> {
        try {
            const result = await SubscriptionModel.findByIdAndDelete(id).exec();
            if (!result) {
                throw new Error(`Subscription with ID ${id} not found`);
            }
        } catch (error) {
            throw new Error("Failed to delete subscription: " + error);
        }
    }

    async deleteAllSubscriptions() {
        try {
            await SubscriptionModel.deleteMany({});
        } catch (error) {
            console.error(
                "An error occurred while deleting all subscriptions:",
                error
            );
            throw error;
        }
    }

    async updateAllSubscriptionsStatus(status: SubscriptionStatus) {
        try {
            await SubscriptionModel.updateMany({}, { status });
        } catch (error) {
            console.error(
                "An error occurred while updating all subscriptions' status:",
                error
            );
            throw error;
        }
    }

    private parseSubscription(
        doc:
            | Document<unknown, {}, Subscription> &
                  Subscription & {
                      _id: Types.ObjectId;
                  }
    ): Subscription {
        return {
            subscriptionId: doc._id,
            name: doc.name,
            cost: doc.cost,
            searchCount: doc.searchCount,
            status: doc.status,
        };
    }
}

export default new SubscriptionService();
