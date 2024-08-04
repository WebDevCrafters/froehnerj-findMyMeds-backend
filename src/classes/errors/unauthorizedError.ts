import { StatusCode } from "../../constants/statusCode";
import { StatusMessage } from "../../constants/statusMessage";
import CustomError from "../../interfaces/errors/customError";

export class UnauthorizedError extends Error implements CustomError {
    statusCode: number;
    message: string;

    constructor(message: string = StatusMessage.UNAUTHORIZED) {
        super(message);
        this.statusCode = StatusCode.UNAUTHORIZED;
        this.message = message;
    }
}
