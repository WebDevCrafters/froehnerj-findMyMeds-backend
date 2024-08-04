import { AuthEndpoints } from "../interfaces/endpoints/authEndpoints";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../interfaces/requests/AuthRequest";
import { AuthResponseJSON } from "../interfaces/responses/AuthResponse";
import UserModel from "../models/UserModel";
import { User } from "../interfaces/schemaTypes/User";
import { NotFoundError } from "../classes/errors/notFoundError";
import { ConflictError } from "../classes/errors/conflictError";
import { BadRequestError } from "../classes/errors/badRequestError";

class AuthController implements AuthEndpoints {
    public async signIn(req: AuthRequest, res: Response) {
        const { email } = req.body;
        const userFromDB: User | null = await UserModel.findById(email);

        if (!userFromDB) {
            throw new NotFoundError();
        }

        const responseBody: AuthResponseJSON = {
            accessToken: "fsgs",
            user: userFromDB,
        };

        res.json(responseBody);
    }

    public async signUp(req: AuthRequest, res: Response) {
        const user = req.body;
        const { email, password, name, userType } = user;
        
        if (!(email && password && name && userType)) {
            throw new BadRequestError();
        }
        
        const userFromDB = await UserModel.findOne({ email: email });
        if (userFromDB) {
            throw new ConflictError();
        }

        const newUser = await UserModel.create(user);
        const authResponse: AuthResponseJSON = {
            accessToken: "sdf",
            user: newUser,
        };
        res.json(authResponse);
    }
}

export const authController = new AuthController();
