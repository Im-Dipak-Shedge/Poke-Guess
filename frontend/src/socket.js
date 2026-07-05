import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_BACKEND_URL);

socket.on("connect", () => {
    console.log("Connected:", socket.id);
});

socket.on("connect_error", (err) => {
    console.log("Connect Error:", err.message);
});

export default socket;