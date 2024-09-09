import express, { Request, Response } from "express";
import dotenv from "dotenv";
import connectToDB from "./config/dbConnection";
import userRouter from "./routes/userRoutes";
import errorHandler from "./middleware/errorHandler";
import searchRouter from "./routes/searchRoutes";
import subscriptionRouter from "./routes/subscriptionRoutes";
import paymentRouter from "./routes/paymentRoutes";
import availabilityRouter from "./routes/availabilityRoutes";
import pharmacyRouter from "./routes/pharmacyRoutes";
import cors from "cors";
import notificationRouter from "./routes/notificationRoutes";
import { createServer } from "http";
import { Socket, Server } from "socket.io";
import SocketService from "./services/socket.service";
import OTPRouter from "./routes/otpRoutes";

dotenv.config();
const app = express();
connectToDB();
const corsOrigin = process.env.CORS_ORIGIN;

app.use(
    cors({
        origin: corsOrigin,
        methods: "GET,POST,PUT,DELETE",
    })
);
app.use(express.json());
app.use("/api/user", userRouter);
app.use("/api/search", searchRouter);
app.use("/api/subscription", subscriptionRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/availability", availabilityRouter);
app.use("/api/pharmacies", pharmacyRouter);
app.use("/api/notification", notificationRouter);
app.use("/api/otp", OTPRouter);
app.use(errorHandler);

export default app;
