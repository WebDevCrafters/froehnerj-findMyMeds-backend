import NotificationModel from "../models/NotificationModel";
import { Notification } from "../interfaces/schemaTypes/Notification";
import { Document, Types } from "mongoose";

class NotificationService {
    async insertAndSend(notification: Notification) {
        const newNotification = await NotificationModel.create(notification);
        this.send(notification);
        return newNotification;
    }

    async update(notification: Notification) {
        const updatedNotification = await NotificationModel.findByIdAndUpdate(
            notification.notificationId,
            notification,
            { new: true, runValidators: true }
        );
        if (!updatedNotification) return null;

        return updatedNotification;
    }

    async send(notification: Notification) {
    }

    async getNotifications(userId: string | Types.ObjectId, page: number, limit: number) {
        const skip = (page - 1) * limit;
        const notifications = await NotificationModel.find({
            userId: new Types.ObjectId(userId),
        })
            .sort({ createdOn: -1 })
            .skip(skip)
            .limit(limit);
        return notifications.map((doc) => this.mapToMotification(doc));
    }

    mapToMotification(
        notificationDoc: Document<unknown, {}, Notification> &
            Notification & {
                _id: Types.ObjectId;
            }
    ): Notification {
        return {
            notificationId: notificationDoc._id,
            createdOn: notificationDoc.createdOn,
            isRead: notificationDoc.isRead,
            notificationType: notificationDoc.notificationType,
            userId: notificationDoc.userId,
            data: notificationDoc.data
        };
    }
}

export default new NotificationService();
