import express, { Request, Response } from "express";
import dotenv from "dotenv";
import connectToDB from "./config/dbConnection";
import userRouter from "./routes/userRoutes";
import errorHandler from "./middleware/errorHandler";
import searchRouter from "./routes/searchRoutes";
import subscriptionRouter from "./routes/subscriptionRoutes";
import paymentRouter from "./routes/paymentRoutes";
import availabilityRouter from "./routes/availabilityRoutes";

dotenv.config();
const app = express();
connectToDB();

app.use(express.json());
app.use("/api/user", userRouter);
app.use("/api/search", searchRouter);
app.use("/api/subscription", subscriptionRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/availability", availabilityRouter);
app.use(errorHandler);

export default app;
