import { ClientSession, Types } from "mongoose";
import Availability from "../interfaces/schemaTypes/Availability";
import AvailabilityModel from "../models/AvailabilityModel";
import { Server } from "http";
import { ServerError } from "../classes/errors/serverError";
import { NotFoundError } from "../classes/errors/notFoundError";

class AvailabilityService {
    async insertAvailability(
        availability: Availability,
        options?: { session?: ClientSession }
    ): Promise<Availability> {
        const insertedAvailability = await AvailabilityModel.create(
            [availability],
            {
                session: options?.session,
            }
        );
        const { _id, __v, availabilityId, ...rest } =
            insertedAvailability[0].toObject() as Availability & {
                _id: Types.ObjectId;
                __v?: number;
            };
        return {
            availabilityId: _id,
            ...rest,
        };
    }

    async deleteAvailability(
        availabilityId: string,
        options?: { session?: ClientSession }
    ) {
        const deleteRes = await AvailabilityModel.deleteOne(
            { _id: availabilityId },
            { session: options?.session }
        );

        if (!deleteRes || !deleteRes.acknowledged) throw new ServerError();
        if (deleteRes.deletedCount < 1) throw new NotFoundError();

        return deleteRes;
    }
}

export default new AvailabilityService();
