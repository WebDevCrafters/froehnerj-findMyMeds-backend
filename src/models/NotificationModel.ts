import { Schema, model, Types } from "mongoose";
import { Notification } from "../interfaces/schemaTypes/Notification";

const NotificationSchema: Schema<Notification> = new Schema({
    userId: {
        type: Types.ObjectId,
        ref: "User",
        required: true,
    },
    notificationType: {
        type: String,
        enum: Object.values(NotificationType),
        required: true,
    },
    createdOn: {
        type: Number,
        required: true,
        default: Date.now()
    },
    isRead: { type: Boolean, required: true },
});

const NotificationModel = model<Notification>(
    "Notification",
    NotificationSchema
);

export default NotificationModel;
