import { Response } from "express"
import { User } from "../schemaTypes/User";

export interface AuthResponse extends Response{
    body: AuthResponseBody
}

export interface AuthResponseBody{
    accessToken: string;
    user: User
}