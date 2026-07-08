import Room from "../models/Room.js";
import Pokemon from "../models/Pokemon.js";

const activeGames = {};
const gameTimers = {};


function startRound(io, room) {
    const game = activeGames[room.roomCode];

    game.currentPokemon =
        game.roundPokemon[room.currentRound - 1];

    const currentPokemon = game.currentPokemon;

    // Safety: remove any existing timer
    if (gameTimers[room.roomCode]) {
        clearInterval(gameTimers[room.roomCode]);
    }

    let timeLeft = 10;

    io.to(room.roomCode).emit("round-started", {
        round: room.currentRound,
        totalRounds: room.settings.rounds,
        timeLeft,
        artwork: currentPokemon.artwork,
        types: currentPokemon.types,
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




                // Get all pokemon from selected generations
                const pokemonPool = await Pokemon.find({
                    generation: { $in: room.settings.generations },
                });

                // Make sure we have enough pokemon
                if (pokemonPool.length < room.settings.rounds) {
                    socket.emit(
                        "error-message",
                        "Not enough Pokémon in selected generations."
                    );
                    return;
                }

                // Shuffle
                pokemonPool.sort(() => Math.random() - 0.5);

                // Pick only as many as rounds
                const roundPokemon = pokemonPool.slice(
                    0,
                    room.settings.rounds
                );

                // Save current game's pokemon in memory
                activeGames[roomCode] = {
                    roundPokemon,
                    revealedLetters: [],
                    guessedPlayers: [],
                    currentPokemon: null,
                };

                room.status = "playing";
                room.currentRound = 1;

                await room.save();

                io.to(roomCode).emit("game-start", {
                    room,
                    round: room.currentRound,
                    totalRounds: room.settings.rounds,
                    timeLeft: 10,
                });

                setTimeout(() => {
                    startRound(io, room);
                }, 1000);

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

    });
}