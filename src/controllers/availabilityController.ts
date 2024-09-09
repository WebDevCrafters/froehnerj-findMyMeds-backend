import { Request, Response } from "express";
import AvailablityEndpoints from "../interfaces/endpoints/availabilityEndpoints";
import { BadRequestError } from "../classes/errors/badRequestError";
import AvailabilityModel from "../models/AvailabilityModel";
import availabilityService from "../services/availability.service";
import { ServerError } from "../classes/errors/serverError";
import mongoose, { isValidObjectId, Types } from "mongoose";
import isAvailability from "../utils/guards/isAvailibility";
import searchService from "../services/search.service";
import notificationService from "../services/notification.service";
import { Notification } from "../interfaces/schemaTypes/Notification";
import { NotificationType } from "../interfaces/schemaTypes/enums/NotificationType";
import userService from "../services/user.service";

class AvailabilityController implements AvailablityEndpoints {
    async add(req: Request, res: Response) {
        const availability = req.body;
        const user = req.user;

        /**
            @todo: Check if user is a clinician
         */

        if (!availability || !availability.search) throw new BadRequestError();

        availability.clinician = user.userId;

        if (!isAvailability(availability)) throw new BadRequestError();
        // availability.markedOn = Date.now();

        const check = await availabilityService.checkIfIMarked(
            user.userId,
            availability.search
        );
        if (check) throw new BadRequestError("Already marked as available.");
        const insertedAvailability =
            await availabilityService.insertAvailability(availability);

        if (!insertedAvailability) throw new ServerError();

        const search = await searchService.getSearch(availability.search);

        let clinician = null;
        if (insertedAvailability.clinician instanceof Types.ObjectId) {
            clinician = await userService.getSecureUser(
                insertedAvailability.clinician
            );
        }
        if (search?.patient && clinician) {
            insertedAvailability.clinician = clinician;
            const notification: Notification = {
                createdOn: Date.now(),
                isRead: false,
                notificationType: NotificationType.MarkAsAvailable,
                userId: search.patient._id,
                data: insertedAvailability,
            };
            notificationService.insertAndSend(notification);
        }
        res.json(insertedAvailability);
    }

    async remove(req: Request, res: Response) {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) throw new BadRequestError();

        const deleteRes = await availabilityService.deleteAvailability(id);
        if (!deleteRes) throw new ServerError();

        res.json("Removed availability " + id);
    }

    async getAvailabilityBySearchId(req: Request, res: Response) {
        const { searchId } = req.params;

        if (!searchId) throw new BadRequestError();

        const avalabilities =
            await availabilityService.getAvailabilityBySearchIdBulk(searchId);

        res.json(avalabilities);
    }

    async checkIfIMarked(req: Request, res: Response) {
        const userId = req.user.userId;
        const { searchId } = req.params;
        const markedByMe = await availabilityService.checkIfIMarked(
            userId,
            searchId
        );
        res.json({ markedByMe: markedByMe });
    }
}

export default new AvailabilityController();
