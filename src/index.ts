import { createServer } from "http";
import app from "./app";
import { Server, Socket } from "socket.io";
import SocketService from "./services/socket.service";

const port = process.env.PORT;

const server = app.listen(port || 5000, () => {
    console.log(`[server]: Server is running at http://localhost:${ port }`);
});

SocketService.getInstance().initialize(server);
