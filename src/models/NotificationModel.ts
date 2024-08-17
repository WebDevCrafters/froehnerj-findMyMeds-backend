import { Schema, model, Types } from "mongoose";

const NotificationSchema = new Schema(
    {
        patientId: {
            type: Types.ObjectId,
            ref: "User",
            required: true,
        },
        clinicianId: {
            type: Types.ObjectId,
            ref: "Clinician",
            required: true,
        },
        medicationId: {
            type: Types.ObjectId,
            ref: "Medication",
            required: true,
        },
        type: {
            type: String,
            enum: Object.values(NotificationType),
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        read: {
            type: Boolean,
            default: false,
        },
        timestamp: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

const NotificationModel = model("Notification", NotificationSchema);

export default NotificationModel;
