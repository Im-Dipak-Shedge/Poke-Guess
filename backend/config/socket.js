import { Server } from "socket.io";

export default function initializeSocket(server) {
    const io = new Server(server, {
        cors: {
            origin: process.env.CLIENT_URL,
            methods: ["GET", "POST"],
            credentials: true,
        },
    });

    io.engine.on("connection_error", (err) => {
        console.log("Socket connection error:", err.message);
    });

    return io;
}