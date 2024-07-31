import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
const connectDB = require('./config/dbConnection')

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

connectDB()
app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server Hii");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});