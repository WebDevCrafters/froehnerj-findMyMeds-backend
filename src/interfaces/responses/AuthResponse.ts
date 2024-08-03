import { User } from "../schemaTypes/User";

export interface AuthResponseJSON {
    accessToken: string;
    user: User;
}
