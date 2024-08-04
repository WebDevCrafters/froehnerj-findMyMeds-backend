import express, { Request, Response } from "express";
import dotenv from 'dotenv';
import connectToDB from "./config/dbConnection";
import userRouter from "./routes/authRoutes";
import errorHandler from "./middleware/errorHandler";

dotenv.config();
const app = express();
connectToDB();

app.use(express.json())
app.use("/api/user", userRouter)
app.use(errorHandler)

export default app;
