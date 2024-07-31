import express, { Request, Response } from "express";
import dotenv from 'dotenv';
import connectToDB from "./config/dbConnection";
import authRouter from "./routes/authRoutes";

dotenv.config();
const app = express();
connectToDB();

app.use("/api/auth", authRouter)

export default app;
