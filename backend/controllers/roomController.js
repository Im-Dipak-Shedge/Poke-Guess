import Room from "../models/Room.js";
import generateRoomId from "../utils/generateRoomId.js";

export const createRoom = async (req, res) => {
    try {
        const {
            hostName,
            avatar,
            rounds,
            generations,
        } = req.body;

        console.log(hostName, avatar, rounds, generations);

        let roomId;

        while (true) {
            roomId = generateRoomId();

            const exists = await Room.findOne({ roomId });

            if (!exists) break;
        }

        const room = await Room.create({
            roomCode: roomId,

            settings: {
                rounds,
                generations,
            },

            players: [
                {
                    trainerName: hostName,
                    trainerAvatar: avatar,
                    score: 0,
                    isHost: true,
                },
            ],
        });

        res.status(201).json(room);

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: "Couldn't create room",
        });

    }
};


export const joinRoom = async (req, res) => {
    try {
        const { roomCode, trainerName, trainerAvatar } = req.body;

        const room = await Room.findOne({ roomCode });

        if (!room) {
            return res.status(404).json({
                message: "Room not found",
            });
        }

        if (room.players.length >= room.maxPlayers) {
            return res.status(400).json({
                message: "Room is full",
            });
        }

        const alreadyJoined = room.players.find(
            (player) => player.trainerName === trainerName
        );

        if (alreadyJoined) {
            return res.status(400).json({
                message: "Trainer name already taken",
            });
        }

        room.players.push({
            trainerName,
            trainerAvatar,
            score: 0,
            isHost: false,
        });

        await room.save();

        res.status(200).json(room);
    } catch (err) {
        console.log(err);

        res.status(500).json({
            message: "Couldn't join room",
        });
    }
};