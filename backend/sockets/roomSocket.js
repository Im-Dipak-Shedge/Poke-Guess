import Room from "../models/Room.js";

export default function roomSocket(io) {
    io.on("connection", (socket) => {


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
            try {
                console.log(`Socket disconnection event`);
                const room = await Room.findOne({
                    "players.socketId": socket.id,
                });

                if (!room) return;

                const player = room.players.find(
                    p => p.socketId === socket.id
                );

                if (!player) return;

                console.log(`${player.trainerName} disconnected`);

                // Host left -> close room
                if (player.isHost) {

                    io.to(room.roomCode).emit("room-closed");

                    await Room.deleteOne({
                        roomCode: room.roomCode,
                    });

                    console.log(`Room ${room.roomCode} deleted`);

                    return;
                }

                // Normal player left
                room.players = room.players.filter(
                    p => p.socketId !== socket.id
                );

                await room.save();

                io.to(room.roomCode).emit("room-updated", room);

                console.log(`${player.trainerName} left the room`);

            } catch (err) {
                console.log(err);
            }
        });

        //game start
        socket.on("start-game", async ({ roomCode }) => {
            try {

                const room = await Room.findOne({ roomCode });

                if (!room) return;

                // Find the player who clicked Start
                const player = room.players.find(
                    p => p.socketId === socket.id
                );

                // Player not found
                if (!player) return;

                // Only host can start
                if (!player.isHost) return;

                // Optional: Need at least 2 players
                if (room.players.length < 2) {
                    socket.emit("error-message", "Need at least 2 players.");
                    return;
                }

                // Update room status
                room.status = "playing";

                await room.save();

                io.to(roomCode).emit("game-start", {
                    room,
                    round: 1,
                    totalRounds: room.settings.rounds,
                });

            } catch (err) {
                console.log(err);
            }
        });
    });
}