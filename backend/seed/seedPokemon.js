import axios from "axios";
import dotenv from "dotenv";

import connectDB from "../config/db.js";
import Pokemon from "../models/pokemon.js";

dotenv.config();

const seedPokemon = async () => {
    try {
        await connectDB();

        console.log("Connected to MongoDB");

        // Delete old data (optional)
        await Pokemon.deleteMany({});

        const pokemonList = [];

        // Loop through all generations
        for (let generation = 1; generation <= 9; generation++) {
            console.log(`Fetching Generation ${generation}...`);

            const generationRes = await axios.get(
                `https://pokeapi.co/api/v2/generation/${generation}`
            );

            const species = generationRes.data.pokemon_species;

            for (const pokemon of species) {

                // Get species information
                const speciesRes = await axios.get(pokemon.url);

                // Extract Pokemon ID
                const pokemonId = speciesRes.data.id;

                // Fetch pokemon by ID instead of name
                const details = await axios.get(
                    `https://pokeapi.co/api/v2/pokemon/${pokemonId}`
                );

                pokemonList.push({
                    pokemonId,
                    name: details.data.name,
                    generation,
                    types: details.data.types.map(t => t.type.name),
                    artwork: details.data.sprites.other["official-artwork"].front_default,
                });

                console.log(`✔ ${details.data.name}`);
            }
        }

        await Pokemon.insertMany(pokemonList);

        console.log(`\n🎉 Inserted ${pokemonList.length} Pokémon`);

        process.exit();
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
};

seedPokemon();