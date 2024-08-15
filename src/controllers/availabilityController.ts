import { Request, Response } from "express";
import AvailablityEndpoints from "../interfaces/endpoints/availabilityEndpoints";
import { BadRequestError } from "../classes/errors/badRequestError";
import AvailabilityModel from "../models/AvailabilityModel";
import availabilityService from "../services/availability.service";
import { ServerError } from "../classes/errors/serverError";
import mongoose, { isValidObjectId, Types } from "mongoose";

class AvailabilityController implements AvailablityEndpoints {
    async add(req: Request, res: Response) {
        const availability = req.body;
        const user = req.user;

        if (!availability) throw new BadRequestError();

        availability.clinicianId = user.userId;

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
}

export default new AvailabilityController();
