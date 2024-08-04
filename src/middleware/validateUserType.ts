import { Request, Response, NextFunction } from "express";
import { UserType } from "../interfaces/schemaTypes/enums/UserType";
import { BadRequestError } from "../classes/errors/badRequestError";

export const validateUserType = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const user = req.body?.user;
    if (!user) {
        throw new BadRequestError("Invalid request body.");
    }

    const { userType } = user;
    if (!userType) {
        throw new BadRequestError("Invalid request body.");
    }

    if (!Object.values(UserType).includes(userType)) {
        throw new BadRequestError("Invalid user type.");
    }

    next();
};
