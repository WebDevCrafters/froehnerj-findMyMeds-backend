import { UserEndpoints } from "../interfaces/endpoints/userEndpoints";
import { Request, Response } from "express";
import UserModel from "../models/UserModel";
import { NotFoundError } from "../classes/errors/notFoundError";
import { ConflictError } from "../classes/errors/conflictError";
import { BadRequestError } from "../classes/errors/badRequestError";
import { getJWTToken } from "../utils/jwtManager";
import User from "../interfaces/schemaTypes/User";
import { ForbiddenError } from "../classes/errors/forbiddenError";
import SecureUser from "../interfaces/responses/SecureUser";
import { comparePassword, hashPassword } from "../utils/bcryptManager";
import { UnauthorizedError } from "../classes/errors/unauthorizedError";
import mongoose from "mongoose";
import { AuthResponseJSON } from "../interfaces/responses/AuthResponse";

class UserController implements UserEndpoints {
    public async signIn(req: Request, res: Response) {
        const user = req.body;
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

        const accessToken = getJWTToken(userFromDB);

        const userResponse: SecureUser = {
            userId: userFromDB._id,
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

    public async signUp(req: Request, res: Response) {
        const user = req.body;
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
        const accessToken = getJWTToken(newUser);

        const userResponse: SecureUser = {
            userId: newUser._id,
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

    public async updateUser(req: Request, res: Response) {
        const updateUserRequest = req.body;

        if (!updateUserRequest) throw new BadRequestError();

        const { _id: userId, password } = updateUserRequest;

        if (!mongoose.isValidObjectId(userId)) {
            throw new BadRequestError("Invalid user Id");
        }

        let hashedPassword;
        if (password) {
            hashedPassword = await hashPassword(password);
        }

        updateUserRequest.password = hashedPassword;

        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            updateUserRequest,
            { new: true, runValidators: true }
        );

        if (!updatedUser) throw new NotFoundError();

        const userResult: SecureUser = {
            userId: updatedUser._id,
            dob: updatedUser.dob,
            doctorId: updatedUser.doctorId,
            email: updatedUser.email,
            locationId: updatedUser.locationId,
            name: updatedUser.name,
            phoneNumber: updatedUser.phoneNumber,
            userType: updatedUser.userType,
        };

        res.json(userResult);
    }

    public async getUser(req: Request, res: Response) {
        const idetifier = req.params.id;

        if (!idetifier) throw new BadRequestError();

        let userFromDB = null;
        if (mongoose.isValidObjectId(idetifier)) {
            userFromDB = await UserModel.findById(idetifier);
        } else {
            userFromDB = await UserModel.findOne({ email: idetifier });
        }

        if (!userFromDB) throw new NotFoundError();

        const userResponse: SecureUser = {
            userId: userFromDB._id,
            email: userFromDB.email,
            phoneNumber: userFromDB.phoneNumber,
            name: userFromDB.name,
            userType: userFromDB.userType,
            dob: userFromDB.dob,
            doctorId: userFromDB.doctorId,
            locationId: userFromDB.locationId,
        };

        res.json(userResponse);
    }

    sendOTP(req: Request, res: Response) {}

    verifyOTP(req: Request, res: Response) {}
}

export const userController = new UserController();
