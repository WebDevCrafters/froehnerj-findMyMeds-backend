import { StatusCode } from "../../constants/statusCode";
import { StatusMessage } from "../../constants/statusMessage";
import CustomError from "../../interfaces/errors/customError";

export class BadRequestError extends Error implements CustomError {
    statusCode: number;
    message: string;

    constructor(message: string = StatusMessage.BAD_REQUEST_ERROR) {
        super(message);
        this.statusCode = StatusCode.BAD_REQUEST_ERROR;
        this.message = message;
    }
}
