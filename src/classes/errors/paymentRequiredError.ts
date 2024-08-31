import { StatusCode } from "../../constants/statusCode";
import { StatusMessage } from "../../constants/statusMessage";
import CustomError from "../../interfaces/errors/customError";

export class PaymentRequiredError extends Error implements CustomError {
    statusCode: number;
    message: string;

    constructor(message: string = StatusMessage.PAYMENT_REQUIRED_ERROR) {
        super(message);
        this.statusCode = StatusCode.PAYMENT_REQUIRED;
        this.message = message;
    }
}
