import User  from "../schemaTypes/User";
import SecureUser from "./SecureUser";

export interface AuthResponseJSON {
    accessToken: string;
    user: SecureUser;
}
