import { ObjectId } from "mongoose";

export interface Notification {
    notificationId?: ObjectId;
    notificationType: NotificationType;
    createdOn: number;
    userId: ObjectId;
    isRead: boolean;
    data?: any;
}
