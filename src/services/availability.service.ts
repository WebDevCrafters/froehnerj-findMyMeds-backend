import { ClientSession, Types } from "mongoose";
import Availability from "../interfaces/schemaTypes/Availability";
import AvailabilityModel from "../models/AvailabilityModel";
import { Server } from "http";
import { ServerError } from "../classes/errors/serverError";

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
            { availabilityId },
            { session: options?.session }
        );

        if (!deleteRes || deleteRes.deletedCount > 1) throw new ServerError();

        return deleteRes;
    }
}

export default new AvailabilityService();
