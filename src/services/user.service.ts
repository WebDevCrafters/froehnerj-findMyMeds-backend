import { Document, Types } from "mongoose";
import User from "../interfaces/schemaTypes/User";
import SecureUser from "../interfaces/responses/SecureUser";

class UserService {
    makeDocToAvailibility(
        doc: Document<unknown, {}, SecureUser> &
            SecureUser & {
                _id: Types.ObjectId;
            }
    ) {
        const { _id, __v, userId, password, ...rest } =
            doc.toObject() as SecureUser & {
                _id: Types.ObjectId;
                __v: number;
                password: string;
            };
        return {
            userId: _id,
            ...rest,
        };
    }
}

export default new UserService();
