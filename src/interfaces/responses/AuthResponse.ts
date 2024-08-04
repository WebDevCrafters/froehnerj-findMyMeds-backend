import User  from "../schemaTypes/User";
import UserResponse from "./UserResponse";

export interface AuthResponseJSON {
    accessToken: string;
    user: UserResponse;
}
