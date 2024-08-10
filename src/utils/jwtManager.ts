import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { BadRequestError } from "../classes/errors/badRequestError";
import { ServerError } from "../classes/errors/serverError";
import User from "../interfaces/schemaTypes/User";

export const getJWTToken = (user: User): string => {
    const secretKey = getSecretkey();

    const token: string = jwt.sign(
        {
            user: {
                _id: user._id,
                email: user.email,
            },
        },
        secretKey
    );

    return token;
};

export const getSecretkey = (): string => {
    const secretKey = process.env.ACCESS_TOKEN_SECRET;
    if (!secretKey) {
        throw new ServerError();
    }
    return secretKey;
};
