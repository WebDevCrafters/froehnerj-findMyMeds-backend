import { Types } from "mongoose";
import { NotificationType } from "./enums/NotificationType";

export interface Notification {
    notificationId?: Types.ObjectId;
    notificationType: NotificationType;
    createdOn: number;
    userId?: Types.ObjectId;
    isRead: boolean;
    data?: any;
}
