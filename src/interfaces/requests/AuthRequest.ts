import { Request } from "express";
import { User } from "../schemaTypes/User";

export interface AuthRequest extends Request{
    body: User
}