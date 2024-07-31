import express, { Request, Response } from "express";
import dotenv from 'dotenv';
import connectToDB from "./config/dbConnection";
import authRoutes from "./routes/authRoutes";

dotenv.config();
const app = express();
connectToDB();

app.use("/api/auth", authRoutes)

export default app;
