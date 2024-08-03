import Error, { Request, Response, NextFunction } from "express";
import ErrorResponse from "../interfaces/responses/ErrorResponse";
import CustomError from "../interfaces/errors/customError";
import { StatusCode } from "../constants/statusCode";
import { StatusMessage } from "../constants/statusMessage";

const errorHandler = (
    err: CustomError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const status = err.statusCode || StatusCode.SERVER_ERROR;
    const message = err.message || StatusMessage.SERVER_ERROR;

    const errorResponse: ErrorResponse = {
        message: message,
        status: status,
    };

    res.status(status).json(errorResponse);
    next();
};

export default errorHandler;
