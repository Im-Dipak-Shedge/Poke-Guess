import Room from "../models/Room.js";

export default function roomSocket(io) {
    io.on("connection", (socket) => {

        console.log("Connected:", socket.id);

        socket.on("join-room", async ({ roomCode, trainerName }) => {

            socket.join(roomCode);

            const room = await Room.findOne({ roomCode });

            if (!room) return;

            const player = room.players.find(
                p => p.trainerName === trainerName
            );

            if (player) {
                player.socketId = socket.id;
                await room.save();

                console.log(`${trainerName} -> ${socket.id}`);
            }

            io.to(roomCode).emit("room-updated", room);
        });

        socket.on("disconnect", async () => {

            const room = await Room.findOne({
                "players.socketId": socket.id,
            });

            if (!room) return;

            const player = room.players.find(
                p => p.socketId === socket.id
            );

            if (player) {
                player.socketId = "";
                await room.save();
            }

            console.log("Disconnected:", socket.id);
        });
    });
}