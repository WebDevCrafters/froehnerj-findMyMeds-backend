import { StatusCode } from "../../constants/statusCode";
import { StatusMessage } from "../../constants/statusMessage";
import CustomError from "../../interfaces/errors/customError";

export class ConflictError extends Error implements CustomError {
    statusCode: number;
    message: string;

    constructor(message: string = StatusMessage.CONFLICT_ERROR) {
        super(message);
        this.statusCode = StatusCode.CONFLICT_ERROR;
        this.message = message;
    }
}
