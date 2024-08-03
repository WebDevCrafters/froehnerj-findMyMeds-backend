import { StatusCode } from "../../constants/statusCode";
import { StatusMessage } from "../../constants/statusMessage";
import CustomError from "../../interfaces/errors/customError";

export class NotFoundError extends Error implements CustomError {
    statusCode: number;
    message: string;

    constructor(message: string = StatusMessage.NOT_FOUND) {
        super(message);
        this.statusCode = StatusCode.NOT_FOUND;
        this.message = message;
    }
}
