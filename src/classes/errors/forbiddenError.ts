import { StatusCode } from "../../constants/statusCode";
import { StatusMessage } from "../../constants/statusMessage";
import CustomError from "../../interfaces/errors/customError";

export class ForbiddenError extends Error implements CustomError {
    statusCode: number;
    message: string;

    constructor(message: string = StatusMessage.FORBIDDEN) {
        super(message);
        this.statusCode = StatusCode.FORBIDDEN;
        this.message = message;
    }
}
