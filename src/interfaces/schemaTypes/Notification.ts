import { Types } from "mongoose";

export interface Notification {
    notificationId?: Types.ObjectId;
    notificationType: NotificationType;
    createdOn: number;
    userId?: Types.ObjectId;
    isRead: boolean;
    data?: any;
}
