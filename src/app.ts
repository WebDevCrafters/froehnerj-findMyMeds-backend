import express, { Request, Response } from "express";
import dotenv from 'dotenv';
import connectToDB from "./config/dbConnection";
import userRouter from "./routes/userRoutes";
import errorHandler from "./middleware/errorHandler";
import searchRouter from "./routes/searchRoutes";

dotenv.config();
const app = express();
connectToDB();

app.use(express.json())
app.use("/api/user", userRouter)
app.use("/api/search", searchRouter)
app.use(errorHandler)

export default app;
