import express, { Request, Response } from "express";
import dotenv from 'dotenv';
import connectToDB from "./config/dbConnection";

dotenv.config();
const app = express();
connectToDB();

app.get("/", (req: Request, res: Response) => {
    res.send("Eissa is here")
});

export default app;
