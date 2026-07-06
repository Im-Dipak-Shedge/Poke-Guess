// import Room from "../models/Room.js";
// const gameTimers = {};

// function startRound(io, room) {
//     let timeLeft = 80;

//     io.to(room.roomCode).emit("round-started", {
//         round: room.currentRound,
//         totalRounds: room.settings.rounds,
//         timeLeft,
//     });

//     gameTimers[room.roomCode] = setInterval(async () => {
//         timeLeft--;

//         io.to(room.roomCode).emit("timer-update", timeLeft);

//         if (timeLeft <= 0) {
//             clearInterval(gameTimers[room.roomCode]);
//             delete gameTimers[room.roomCode];

//             room.currentRound++;

//             if (room.currentRound > room.settings.rounds) {
//                 room.status = "finished";
//                 await room.save();

//                 io.to(room.roomCode).emit("game-finished");
//                 return;
//             }

//             await room.save();

//             startRound(io, room);
//         }
//     }, 1000);
// }


// export default function roomSocket(io) {
//     io.on("connection", (socket) => {

//         socket.on("join-room", async ({ roomCode, trainerName }) => {
//             const room = await Room.findOne({ roomCode });

//             if (!room) {
//                 socket.emit("join-error", "Room not found.");
//                 return;
//             }

//             // Prevent joining after game has started
//             if (room.status !== "waiting") {
//                 socket.emit("join-error", "Game has already started.");
//                 return;
//             }

//             socket.join(roomCode);

//             const player = room.players.find(
//                 p => p.trainerName === trainerName
//             );

//             if (player) {
//                 player.socketId = socket.id;
//                 await room.save();
//             }

//             io.to(roomCode).emit("room-updated", room);
//         });
//         socket.on("disconnect", async () => {
//             try {
//                 console.log(`Socket disconnection event`);
//                 const room = await Room.findOne({
//                     "players.socketId": socket.id,
//                 });

//                 if (!room) return;

//                 const player = room.players.find(
//                     p => p.socketId === socket.id
//                 );

//                 if (!player) return;

//                 console.log(`${player.trainerName} disconnected`);

//                 // Host left -> close room
//                 if (player.isHost) {

//                     io.to(room.roomCode).emit("room-closed");

//                     if (gameTimers[room.roomCode]) {
//                         clearInterval(gameTimers[room.roomCode]);
//                         delete gameTimers[room.roomCode];
//                     }
//                     await Room.deleteOne({
//                         roomCode: room.roomCode,
//                     });

//                     console.log(`Room ${room.roomCode} deleted`);

//                     return;
//                 }

//                 // Normal player left
//                 room.players = room.players.filter(
//                     p => p.socketId !== socket.id
//                 );

//                 await room.save();

//                 io.to(room.roomCode).emit("room-updated", room);

//                 console.log(`${player.trainerName} left the room`);

//             } catch (err) {
//                 console.log(err);
//             }
//         });

//         //game start
//         socket.on("start-game", async ({ roomCode }) => {
//             try {

//                 const room = await Room.findOne({ roomCode });

//                 if (!room) return;
//                 if (room.status === "playing") return;

//                 // Find the player who clicked Start
//                 const player = room.players.find(
//                     p => p.socketId === socket.id
//                 );

//                 // Player not found
//                 if (!player) return;

//                 // Only host can start
//                 if (!player.isHost) return;

//                 // Optional: Need at least 2 players
//                 if (room.players.length < 2) {
//                     socket.emit("error-message", "Need at least 2 players.");
//                     return;
//                 }

//                 // Update room status
//                 room.status = "playing";
//                 room.currentRound = 1;

//                 await room.save();

//                 startRound(io, room);

//             } catch (err) {
//                 console.log(err);
//             }
//         });
//     });
// }



import Room from "../models/Room.js";

const gameTimers = {};

function startRound(io, room) {
    // Safety: remove any existing timer
    if (gameTimers[room.roomCode]) {
        clearInterval(gameTimers[room.roomCode]);
    }

    let timeLeft = 80;

    io.to(room.roomCode).emit("round-started", {
        round: room.currentRound,
        totalRounds: room.settings.rounds,
        timeLeft,
    });

    gameTimers[room.roomCode] = setInterval(async () => {
        timeLeft--;

        io.to(room.roomCode).emit("timer-update", timeLeft);

        if (timeLeft <= 0) {
            clearInterval(gameTimers[room.roomCode]);
            delete gameTimers[room.roomCode];

            room.currentRound++;

            if (room.currentRound > room.settings.rounds) {
                room.status = "finished";

                await room.save();

                io.to(room.roomCode).emit("game-finished");

                return;
            }

            await room.save();

            startRound(io, room);
        }
    }, 1000);
}

export default function roomSocket(io) {
    io.on("connection", (socket) => {

        // =========================
        // JOIN ROOM
        // =========================

        socket.on("join-room", async ({ roomCode, trainerName }) => {
            try {
                const room = await Room.findOne({ roomCode });

                if (!room) {
                    socket.emit("join-error", "Room not found.");
                    return;
                }

                if (room.status !== "waiting") {
                    socket.emit("join-error", "Game has already started.");
                    return;
                }

                socket.join(roomCode);

                const player = room.players.find(
                    p => p.trainerName === trainerName
                );

                if (player) {
                    player.socketId = socket.id;
                    await room.save();
                }

                io.to(roomCode).emit("room-updated", room);

            } catch (err) {
                console.log(err);
            }
        });

        // =========================
        // START GAME
        // =========================

        socket.on("start-game", async ({ roomCode }) => {
            try {

                const room = await Room.findOne({ roomCode });

                if (!room) return;

                const player = room.players.find(
                    p => p.socketId === socket.id
                );

                if (!player) return;

                if (!player.isHost) return;

                // Prevent duplicate starts
                if (room.status === "playing") return;

                if (room.players.length < 2) {
                    socket.emit(
                        "error-message",
                        "Need at least 2 players."
                    );
                    return;
                }

                room.status = "playing";
                room.currentRound = 1;

                await room.save();

                // Tell everyone to navigate to Game page
                io.to(roomCode).emit("game-start", {
                    room,
                    round: room.currentRound,
                    totalRounds: room.settings.rounds,
                    timeLeft: 80,
                });

                // Start first round timer
                startRound(io, room);

            } catch (err) {
                console.log(err);
            }
        });

        // =========================
        // DISCONNECT
        // =========================

        socket.on("disconnect", async () => {
            try {

                const room = await Room.findOne({
                    "players.socketId": socket.id,
                });

                if (!room) return;

                const player = room.players.find(
                    p => p.socketId === socket.id
                );

                if (!player) return;

                console.log(`${player.trainerName} disconnected`);

                // Host left
                if (player.isHost && room.status === "waiting") {

                    io.to(room.roomCode).emit("room-closed");

                    if (gameTimers[room.roomCode]) {
                        clearInterval(gameTimers[room.roomCode]);
                        delete gameTimers[room.roomCode];
                    }

                    await Room.deleteOne({
                        roomCode: room.roomCode,
                    });

                    return;
                }
                // Remove player

                room.players = room.players.filter(
                    p => p.socketId !== socket.id
                );

                await room.save();

                io.to(room.roomCode).emit("room-updated", room);

            } catch (err) {
                console.log(err);
            }
        });


        //round
        socket.on("round-started", (data) => {
            setRound(data.round);
            setTotalRounds(data.totalRounds);
            setTimeLeft(data.timeLeft);

            setShowRoundAnimation(true);

            setTimeout(() => {
                setShowRoundAnimation(false);
            }, 3000);
        });
    });
}