import mongoose from "mongoose";

const playerSchema = new mongoose.Schema(
    {
        socketId: {
            type: String,
            default: "",
        },

        trainerName: {
            type: String,
            required: true,
        },

        trainerAvatar: {
            type: String,
            required: true,
        },

        score: {
            type: Number,
            default: 0,
        },

        isHost: {
            type: Boolean,
            default: false,
        },
        isCorrect: {
            type: Boolean,
            default: false,
        },

    },
    { _id: false }
);

const roomSchema = new mongoose.Schema(
    {
        roomCode: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            trim: true,
        },

        players: {
            type: [playerSchema],
            default: [],
        },

        settings: {
            rounds: {
                type: Number,
                enum: [5, 10, 15, 20],
                required: true,
            },

            generations: {
                type: [Number],
                required: true,
            },
        },

        status: {
            type: String,
            enum: ["waiting", "playing", "finished"],
            default: "waiting",
        },

        maxPlayers: {
            type: Number,
            default: 6,
        },
        currentRound: {
            type: Number,
            default: 1,
        },
    },
    {
        timestamps: true,
    }
);

//delete the room after 1 hour of creation
roomSchema.index({ createdAt: 1 }, { expireAfterSeconds: 3600 });

export default mongoose.model("Room", roomSchema);