import mongoose from "mongoose";

const pokemonSchema = new mongoose.Schema({
    pokemonId: {
        type: Number,
        required: true,
        unique: true,
    },

    name: {
        type: String,
        required: true,
    },

    generation: {
        type: Number,
        required: true,
    },

    types: [String],

    artwork: {
        type: String,
        required: true,
    },
});

export default mongoose.model("Pokemon", pokemonSchema);