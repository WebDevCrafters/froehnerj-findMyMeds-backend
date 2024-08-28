import { Request, Response } from "express";
import AvailablityEndpoints from "../interfaces/endpoints/availabilityEndpoints";
import { BadRequestError } from "../classes/errors/badRequestError";
import AvailabilityModel from "../models/AvailabilityModel";
import availabilityService from "../services/availability.service";
import { ServerError } from "../classes/errors/serverError";
import mongoose, { isValidObjectId, Types } from "mongoose";
import isAvailability from "../utils/guards/isAvailibility";

class AvailabilityController implements AvailablityEndpoints {
    async add(req: Request, res: Response) {
        const availability = req.body;
        const user = req.user;

        /**
            @todo: Check if user is a clinician
         */

        if (!availability) throw new BadRequestError();

        availability.clinician = user.userId;

        if (!isAvailability(availability)) throw new BadRequestError();
        availability.markedOn = Date.now();

        const check = await availabilityService.checkIfIMarked(
            user.userId,
            availability.search
        );
        if (check) throw new BadRequestError("Already marked as available.");
        const insertedAvailability =
            await availabilityService.insertAvailability(availability);

        if (!insertedAvailability) throw new ServerError();

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
            await availabilityService.getAvailabilityBySearchId(searchId);

        res.json(avalabilities);
    }
}

export default new AvailabilityController();
