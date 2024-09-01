import { Request, Response } from "express";
import notificationService from "../services/notification.service";
import { NotFoundError } from "../classes/errors/notFoundError";

class NotificationController {
    insert(req: Request, res: Response) {}

    update(req: Request, res: Response) {}

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
}

export default new NotificationController();
