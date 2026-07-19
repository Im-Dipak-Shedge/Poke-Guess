import Room from "../models/room.js";
import Pokemon from "../models/pokemon.js";

const activeGames = {};
const gameTimers = {};
const hintTimers = {};

function startRound(io, room) {
    const game = activeGames[room.roomCode];
    // Reset round state
    game.currentPokemon = game.roundPokemon[room.currentRound - 1];
    game.revealedLetters = [];
    game.guessedPlayers = [];
    io.to(room.roomCode).emit("correct-players", []);
    game.guessOrder = 0;
    game.roundFinished = false;
    game.roundPoints = {};

    const currentPokemon = game.currentPokemon;

    // Clear previous timers
    if (gameTimers[room.roomCode]) {
        clearInterval(gameTimers[room.roomCode]);
        delete gameTimers[room.roomCode];
    }

    if (hintTimers[room.roomCode]) {
        clearInterval(hintTimers[room.roomCode]);
        delete hintTimers[room.roomCode];
    }

    let timeLeft = 62;

    io.to(room.roomCode).emit("round-started", {
        round: room.currentRound,
        totalRounds: room.settings.rounds,
        timeLeft,
        artwork: currentPokemon.artwork,
        types: currentPokemon.types,
        pokemonName: currentPokemon.name,
        revealedLetters: [],
    });

    // ================= HINT TIMER =================
    hintTimers[room.roomCode] = setInterval(() => {
        const hiddenIndexes = [];

        currentPokemon.name.split("").forEach((ch, i) => {
            if (
                ch !== " " &&
                ch !== "-" &&
                !game.revealedLetters.includes(i)
            ) {
                hiddenIndexes.push(i);
            }
        });

        if (hiddenIndexes.length === 0) return;

        game.revealedLetters.push(hiddenIndexes[0]);

        io.to(room.roomCode).emit("hint-update", {
            revealedLetters: [...game.revealedLetters],
        });

    }, 15000);

    // ================= GAME TIMER =================
    gameTimers[room.roomCode] = setInterval(async () => {

        timeLeft--;

        io.to(room.roomCode).emit("timer-update", timeLeft);

        if (timeLeft > 0) return;

        if (game.roundFinished) return;

        game.roundFinished = true;

        clearInterval(gameTimers[room.roomCode]);
        delete gameTimers[room.roomCode];

        clearInterval(hintTimers[room.roomCode]);
        delete hintTimers[room.roomCode];

        room.currentRound++;

        const isLastRound = room.currentRound > room.settings.rounds;

        await room.save();

        io.to(room.roomCode).emit("round-ended", {
            pokemon: game.currentPokemon,
            players: room.players
                .map(player => ({
                    trainerName: player.trainerName,
                    points: game.roundPoints[player.trainerName] || 0,
                }))
                .sort((a, b) => b.points - a.points),
        });

        setTimeout(async () => {
            if (isLastRound) {
                const latestRoom = await Room.findOne({
                    roomCode: room.roomCode,
                });

                const leaderboard = latestRoom.players
                    .map(player => ({
                        trainerName: player.trainerName,
                        trainerAvatar: player.trainerAvatar,
                        score: player.score,
                    }))
                    .sort((a, b) => b.score - a.score);

                io.to(room.roomCode).emit("game-finished", {
                    winner: leaderboard[0],
                    leaderboard,
                });

                delete activeGames[room.roomCode];
            } else {
                startRound(io, room);
            }
        }, 3000);

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
                    guessOrder: 0,
                    roundPoints: {},
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



        ///answring 
        socket.on("guess-pokemon", async ({ roomCode, guess }) => {
            try {

                const room = await Room.findOne({ roomCode });

                if (!room) return;

                const game = activeGames[roomCode];

                if (!game || !game.currentPokemon) return;

                // Ignore guesses once the round has ended
                if (game.roundFinished) return;

                const player = room.players.find(
                    p => p.socketId === socket.id
                );

                if (!player) return;

                const userGuess = guess.trim();

                // ==========================
                // Player already guessed correctly
                // Treat future guesses as CHAT
                // ==========================
                const answer = game.currentPokemon.name
                    .trim()
                    .toLowerCase();

                // normalize spaces
                const normalizedGuess = userGuess
                    .toLowerCase()
                    .replace(/\s+/g, " ");

                const isPokemonName = normalizedGuess === answer;

                if (game.guessedPlayers.includes(player.trainerName)) {

                    // Don't let players reveal the Pokémon name in chat
                    if (isPokemonName) return;

                    io.to(roomCode).emit("guess-message", {
                        player: player.trainerName,
                        guess: userGuess,
                    });

                    return;
                }


                // ==========================
                // WRONG GUESS
                // ==========================
                if (!isPokemonName) {

                    io.to(roomCode).emit("guess-message", {
                        player: player.trainerName,
                        guess: userGuess,
                    });

                    return;
                }

                // ==========================
                // CORRECT GUESS
                // ==========================

                game.guessOrder++;
                game.guessedPlayers.push(player.trainerName);
                io.to(roomCode).emit(
                    "correct-players",
                    [...game.guessedPlayers]
                );

                const points = {
                    1: 100,
                    2: 80,
                    3: 60,
                };

                const earnedPoints = points[game.guessOrder] || 40;

                player.score += earnedPoints;

                game.roundPoints[player.trainerName] = earnedPoints;

                await room.save();

                io.to(roomCode).emit("room-updated", room);

                socket.emit("correct-guess", {
                    artwork: game.currentPokemon.artwork,
                    place: game.guessOrder,
                    score: player.score,
                    pokemonName: game.currentPokemon.name,
                    revealedLetters: game.currentPokemon.name
                        .split("")
                        .map((_, i) => i),
                });

                socket.broadcast.to(roomCode).emit("player-guessed", {
                    player: player.trainerName,
                });

                // Everyone guessed
                if (game.guessedPlayers.length === room.players.length) {

                    if (game.roundFinished) return;

                    game.roundFinished = true;

                    clearInterval(gameTimers[roomCode]);
                    delete gameTimers[roomCode];

                    clearInterval(hintTimers[roomCode]);
                    delete hintTimers[roomCode];

                    room.currentRound++;

                    const isLastRound = room.currentRound > room.settings.rounds;

                    await room.save();

                    io.to(room.roomCode).emit("round-ended", {
                        pokemon: game.currentPokemon,
                        players: room.players
                            .map(player => ({
                                trainerName: player.trainerName,
                                points: game.roundPoints[player.trainerName] || 0,
                            }))
                            .sort((a, b) => b.points - a.points),
                    });

                    setTimeout(async () => {
                        if (isLastRound) {
                            const latestRoom = await Room.findOne({
                                roomCode: room.roomCode,
                            });

                            const leaderboard = latestRoom.players
                                .map(player => ({
                                    trainerName: player.trainerName,
                                    trainerAvatar: player.trainerAvatar,
                                    score: player.score,
                                }))
                                .sort((a, b) => b.score - a.score);

                            io.to(room.roomCode).emit("game-finished", {
                                winner: leaderboard[0],
                                leaderboard,
                            });

                            delete activeGames[room.roomCode];
                        } else {
                            startRound(io, room);
                        }
                    }, 3000);
                }

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

                // Tell everyone that the player left
                io.to(room.roomCode).emit("player-left", {
                    player: player.trainerName,
                });

                io.to(room.roomCode).emit("room-updated", room);

            } catch (err) {
                console.log(err);
            }
        });


        //round

    });
}