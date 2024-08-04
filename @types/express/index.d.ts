import { Express } from "express-serve-static-core";
import SecureUser from "../../src/interfaces/responses/SecureUser";

declare module "express-serve-static-core" {
    interface Request {
        user: SecureUser;
    }
}
