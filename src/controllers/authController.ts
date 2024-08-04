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
import { getJWTToken } from "../config/jwtManager";

class AuthController implements AuthEndpoints {
    public async signIn(req: AuthRequest, res: Response) {
        const { email } = req.body.user;
        const userFromDB: User | null = await UserModel.findById(email);

        if (!userFromDB) {
            throw new NotFoundError();
        }

        const accessToken = getJWTToken(email);

        const responseBody: AuthResponseJSON = {
            accessToken: accessToken,
            user: userFromDB,
        };

        res.json(responseBody);
    }

    public async signUp(req: AuthRequest, res: Response) {
        const user = req.body?.user;
        if (!user) {
            throw new BadRequestError("Invalid request body.");
        }
        
        const { email, password, name, userType } = user;
        if (!(email && password && name && userType)) {
            throw new BadRequestError("Invalid request body.");
        }

        const userFromDB = await UserModel.findOne({ email: email });
        if (userFromDB) {
            throw new ConflictError("User already exists.");
        }

        const newUser = await UserModel.create(user);
        const accessToken = getJWTToken(email);

        const authResponse: AuthResponseJSON = {
            accessToken: accessToken,
            user: newUser,
        };
        res.json(authResponse);
    }
}

export const authController = new AuthController();
