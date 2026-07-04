import Room from "../models/Room.js";
import generateRoomId from "../utils/generateRoomId.js";

export const createRoom = async (req, res) => {
    try {
        const {
            hostName,
            rounds,
            generations,
        } = req.body;

        let roomId;

        while (true) {
            roomId = generateRoomId();

            const exists = await Room.findOne({ roomId });

            if (!exists) break;
        }

        const room = await Room.create({
            roomId,

            host: hostName,

            rounds,

            generations,

            players: [
                {
                    name: hostName,
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