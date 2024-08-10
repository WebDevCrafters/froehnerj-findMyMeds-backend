import jwt from "jsonwebtoken";
import { getSecretkey } from "../utils/jwtManager";
import { BadRequestError } from "../classes/errors/badRequestError";
import { NextFunction, Request, Response } from "express";
import { ForbiddenError } from "../classes/errors/forbiddenError";
import User from "../interfaces/schemaTypes/User";

export const validateTokenHandler = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let accessToken = req.headers.authorization;

    if (!accessToken) {
        return next(new ForbiddenError("Invalid access token"));
    }

    if (accessToken.startsWith("Bearer ")) {
        accessToken = accessToken.split(" ")[1];
    }

    const secretKey = getSecretkey();

    jwt.verify(accessToken, secretKey, (err, decoded) => {
        if (err) {
            return next(new BadRequestError("Invalid access token."));
        }
        const decodedUser = (decoded as { user: User }).user;
        req.user = {
            ...decodedUser,
            userId: decodedUser._id,
        };
        next();
    });
};
