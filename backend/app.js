import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import roomRouter from "./routes/roomRouter.js";
import http from "http";
import initializeSocket from "./config/socket.js";
import roomSocket from "./sockets/roomSocket.js";

dotenv.config();
const app = express();

//Connecting Database
connectDB();

//cross-origin resource sharing (CORS) middleware
app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true,
    })
);

app.use(express.json());
app.use("/api/rooms", roomRouter);

app.get("/", (req, res) => {
    res.send("Backend Running 🚀");
});

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// initialize socket.io
const io = initializeSocket(server);

// register all socket events
roomSocket(io);

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});