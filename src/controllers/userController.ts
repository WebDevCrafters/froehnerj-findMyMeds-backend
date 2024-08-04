import { UserEndpoints } from "../interfaces/endpoints/userEndpoints";
import { Request, Response } from "express";
import { AuthRequest } from "../interfaces/requests/AuthRequest";
import { AuthResponseJSON } from "../interfaces/responses/AuthResponse";
import UserModel from "../models/UserModel";
import { NotFoundError } from "../classes/errors/notFoundError";
import { ConflictError } from "../classes/errors/conflictError";
import { BadRequestError } from "../classes/errors/badRequestError";
import { getJWTToken } from "../utils/jwtManager";
import User from "../interfaces/schemaTypes/User";
import { ForbiddenError } from "../classes/errors/forbiddenError";
import UserResponse from "../interfaces/responses/UserResponse";
import { comparePassword, hashPassword } from "../utils/bcryptManager";
import { UnauthorizedError } from "../classes/errors/unauthorizedError";

class UserController implements UserEndpoints {
    public async signIn(req: AuthRequest, res: Response) {
        const user = req.body?.user;
        if (!user) {
            throw new BadRequestError("Invalid request body.");
        }

        const { email, password } = user;
        if (!email || !password) {
            throw new BadRequestError("Invalid request body.");
        }

        const userFromDB: User | null = await UserModel.findOne({
            email,
        });

        if (!userFromDB) {
            throw new NotFoundError();
        }

        const isPasswordMatch = await comparePassword(
            password,
            userFromDB.password
        );

        if (!isPasswordMatch) {
            throw new UnauthorizedError("Incorrect password.");
        }

        const accessToken = getJWTToken(email);

        const userResponse: UserResponse = {
            _id: userFromDB._id,
            email: userFromDB.email,
            phoneNumber: userFromDB.phoneNumber,
            name: userFromDB.name,
            userType: userFromDB.userType,
            dob: userFromDB.dob,
            doctorId: userFromDB.doctorId,
            locationId: userFromDB.locationId,
        };

        const responseBody: AuthResponseJSON = {
            accessToken: accessToken,
            user: userResponse,
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

        const hashedPassword = await hashPassword(password);
        user.password = hashedPassword;

        const newUser = await UserModel.create(user);
        const accessToken = getJWTToken(email);

        const userResponse: UserResponse = {
            _id: newUser._id,
            email: newUser.email,
            phoneNumber: newUser.phoneNumber,
            name: newUser.name,
            userType: newUser.userType,
            dob: newUser.dob,
            doctorId: newUser.doctorId,
            locationId: newUser.locationId,
        };

        const authResponse: AuthResponseJSON = {
            accessToken: accessToken,
            user: userResponse,
        };
        res.json(authResponse);
    }
}

export const userController = new UserController();
