import { Request, Response } from "express";
import notificationService from "../services/notification.service";
import { NotFoundError } from "../classes/errors/notFoundError";
import { Notification } from "../interfaces/schemaTypes/Notification";

class NotificationController {
    insert(req: Request, res: Response) {}

    async update(req: Request, res: Response) {
        const { isRead, notificationId } = req.body;

        const notification: Notification = {
            notificationId: notificationId,
            isRead: isRead,
        };

        const updatedNotification = await notificationService.update(
            notification
        );

        if (!notification) throw new NotFoundError();

        res.json(updatedNotification);
    }

    send(req: Request, res: Response) {}

    async getNotifications(req: Request, res: Response) {
        const { page, limit } = req.query;
        const user = req.user;

        const notifications = await notificationService.getNotifications(
            user.userId,
            Number(page),
            Number(limit)
        );

        if (!notifications || !notifications.length) throw new NotFoundError();

        res.json(notifications);
    }

    async markAllAsRead(req: Request, res: Response) {
        const user = req.user;

        await notificationService.markAllAsRead(user.userId);

        res.json("Success");
    }

    async getUnreadCount(req: Request, res: Response) {
        const user = req.user;

        const count = await notificationService.getUnreadCount(user.userId);

        res.json({ count });
    }
}

export default new NotificationController();
