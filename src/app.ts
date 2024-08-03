import express, { Request, Response } from "express";
import dotenv from 'dotenv';
import connectToDB from "./config/dbConnection";
import authRouter from "./routes/authRoutes";
import errorHandler from "./middleware/errorHandler";

dotenv.config();
const app = express();
connectToDB();

app.use(express.json())
app.use("/api/auth", authRouter)
app.use(errorHandler)

export default app;
