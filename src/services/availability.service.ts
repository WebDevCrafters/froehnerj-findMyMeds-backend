import { ClientSession, Document, isValidObjectId, Types } from "mongoose";
import Availability from "../interfaces/schemaTypes/Availability";
import AvailabilityModel from "../models/AvailabilityModel";
import { Server } from "http";
import { ServerError } from "../classes/errors/serverError";
import { NotFoundError } from "../classes/errors/notFoundError";
import userService from "./user.service";
import SecureUser from "../interfaces/responses/SecureUser";

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

    async getAvailabilityBySearchId(id: string | Types.ObjectId) {
        const availabilities = await AvailabilityModel.find({ search: id })
            .populate("clinician")
            .select("-password");
        if (!availabilities) throw new NotFoundError();

        return availabilities.map((doc) => this.makeDocToAvailibility(doc));
    }

    async checkIfIMarked(
        userId: string | Types.ObjectId,
        searchId: string | Types.ObjectId
    ): Promise<boolean> {
        const availabilities = await AvailabilityModel.exists({
            clinician: userId,
            search: searchId,
        });

        return !!availabilities;
    }

    makeDocToAvailibility(
        doc: Document<unknown, {}, Availability> &
            Availability & {
                _id: Types.ObjectId;
            }
    ) {
        const { _id, __v, availabilityId, clinician, ...rest } =
            doc.toObject() as Availability & {
                _id: Types.ObjectId;
                __v: number;
            };
        let user = clinician;
        if (!isValidObjectId(clinician)) {
            const { _id, __v, userId, password, ...rest } =
                clinician as SecureUser & {
                    _id: Types.ObjectId;
                    __v: number;
                    password: string;
                };
            user = {
                userId: _id,
                ...rest,
            };
        }
        return {
            availabilityId: _id,
            clinician: user,
            ...rest,
        };
    }
}

export default new AvailabilityService();
