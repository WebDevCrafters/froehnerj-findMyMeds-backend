import Error, { Request, Response, NextFunction } from "express";
import ErrorResponse from "../interfaces/responses/ErrorResponse";
import CustomError from "../interfaces/errors/customError";

const errorHandler = (
    err: CustomError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const status = err.statusCode || 500;

    const errorResponse: ErrorResponse = {
        message: err.message,
        status: status,
    };

    res.status(status).json(errorResponse);
    next();
};

export default errorHandler;
