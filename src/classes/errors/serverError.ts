import { StatusCode } from "../../constants/statusCode";
import { StatusMessage } from "../../constants/statusMessage";
import CustomError from "../../interfaces/errors/customError";

export class ServerError extends Error implements CustomError {
    statusCode: number;
    message: string;

    constructor(message: string = StatusMessage.SERVER_ERROR) {
        super(message);
        this.statusCode = StatusCode.SERVER_ERROR;
        this.message = message;
    }
}
