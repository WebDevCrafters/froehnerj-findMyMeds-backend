import { Server, Socket } from "socket.io";
import { createServer, IncomingMessage, ServerResponse } from "http";
import { SocketEvents } from "../interfaces/schemaTypes/enums/SocketEvents";
import { Notification } from "../interfaces/schemaTypes/Notification";

class SocketService {
    private io: Server | null = null;
    private static instance: SocketService | null = null;

    private constructor() {}

    public static getInstance(): SocketService {
        if (!SocketService.instance) {
            SocketService.instance = new SocketService();
        }
        return SocketService.instance;
    }

    public initialize(server: ReturnType<typeof createServer>): void {
        if (!this.io) {
            this.io = new Server(server, {
                cors: {
                    origin: "*",
                },
            });

            this.initializeSocketEvents();
            console.log("SocketService initialized.");
        } else {
            console.warn("SocketService is already initialized.");
        }
    }

    private initializeSocketEvents() {
        if (!this.io) return;

        this.io.on(SocketEvents.Connection, (socket: Socket) => {
            console.log("New WebSocket connection", socket.id);

            socket.on(SocketEvents.JoinMyRoom, (userId) => {
                socket.join(userId);
                console.log(`User ${userId} joined their own room`);
            });

            socket.on(SocketEvents.Disconnect, () => {
                console.log(`Socket ${socket.id} disconnected`);
            });
        });
    }

    public sendNotificationToUser(notification: Notification) {
        if (!this.io) return;
        const userId = notification.userId?.toString();
        if (!userId) return;

        this.io.to(userId).emit(SocketEvents.Notification, notification);
        console.log(
            `Notification sent to user ${userId}: ${notification.notificationId}`
        );
    }
}

export default SocketService;
