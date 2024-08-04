import jwt from "jsonwebtoken";
import { getSecretkey } from "../utils/jwtManager";
import { BadRequestError } from "../classes/errors/badRequestError";
import { NextFunction, Response } from "express";
import { ForbiddenError } from "../classes/errors/forbiddenError";
import User from "../interfaces/schemaTypes/User";
import { AuthRequest } from "../interfaces/requests/AuthRequest";

export const validateTokenHandler = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    let accessToken = (req.headers as { authorization?: string }).authorization;
    if (!accessToken) {
        throw new ForbiddenError("Invalid access token");
    }
    if (accessToken.startsWith("Bearer")) {
        accessToken = accessToken.split(" ")[1];
    }

    const secretKey = getSecretkey();
    jwt.verify(accessToken, secretKey, (err, decoded) => {
        if (err) {
            throw new BadRequestError("Invalid access token.");
        }

        req.body.user = (decoded as { user: User }).user;
        next();
    });
};
