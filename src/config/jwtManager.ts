import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { BadRequestError } from "../classes/errors/badRequestError";
import { ServerError } from "../classes/errors/serverError";

export const getJWTToken = (email: string): string => {
    const secretKey = getSecretkey();

    const token: string = jwt.sign(
        {
            user: {
                email: email,
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
