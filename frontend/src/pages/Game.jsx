import React, { useEffect, useState } from "react";
import GameHeader from "../components/GameHeader";
import PokemonCard from "../components/PokemonCard";
import PlayerList from "../components/PlayerList";
import ChatBox from "../components/ChatBox";
import GuessInput from "../components/GuessInput";
import { useLocation } from "react-router-dom";
import socket from "../socket";

const mockMessages = [
  {
    id: 1,
    type: "drawing",
    name: "Ash",
    text: "is choosing a Pokémon...",
  },
  {
    id: 2,
    type: "guess",
    name: "Misty",
    text: "Pikachu",
  },
  {
    id: 3,
    type: "guess",
    name: "Gary",
    text: "Raichu",
  },
];

export default function Game() {
  const { state } = useLocation();
  const [guess, setGuess] = useState("");
  const [messages, setMessages] = useState(mockMessages);
  const [timeLeft, setTimeLeft] = useState(state?.gameData?.timeLeft || 10);
  const [round, setRound] = useState(state?.gameData?.round || 1);
  const [showRoundAnimation, setShowRoundAnimation] = useState(true);
  const [pokemonArtwork, setPokemonArtwork] = useState("");
  const [pokemonTypes, setPokemonTypes] = useState([]);
  const [pokemonName, setPokemonName] = useState("");
  const [revealedLetters, setRevealedLetters] = useState([]);

  const [totalRounds, setTotalRounds] = useState(
    state?.gameData?.totalRounds || 1,
  );

  const [players, setPlayers] = useState(state?.room?.players || []);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&display=swap";

    document.head.appendChild(link);

    return () => document.head.removeChild(link);
  }, []);

  //playerlist
  useEffect(() => {
    socket.on("room-updated", (updatedRoom) => {
      setPlayers(updatedRoom.players);
    });

    return () => {
      socket.off("room-updated");
    };
  }, []);

  //timer
  useEffect(() => {
    socket.on("round-started", (data) => {
      setRound(data.round);
      setTotalRounds(data.totalRounds);
      setTimeLeft(data.timeLeft);

      setPokemonArtwork(data.artwork);
      setPokemonTypes(data.types);

      setPokemonName(data.pokemonName);
      setRevealedLetters(data.revealedLetters);

      setShowRoundAnimation(true);

      setTimeout(() => {
        setShowRoundAnimation(false);
      }, 2000);
    });

    socket.on("timer-update", (time) => {
      setTimeLeft(time);
    });

    socket.on("game-finished", () => {
      console.log("Game Finished");
      // We'll navigate to the result screen later.
    });

    socket.on("hint-update", (data) => {
      setRevealedLetters(data.revealedLetters);
    });

    return () => {
      socket.off("round-started");
      socket.off("timer-update");
      socket.off("game-finished");
      socket.off("hint-update");
    };
  }, []);

  const submitGuess = (e) => {
    e.preventDefault();

    if (!guess.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        type: "guess",
        name: "You",
        text: guess,
      },
    ]);

    setGuess("");
  };

  return (
    <div
      className=" h-screen overflow-hidden  bg-repeat lg:px-10 lg:py-4 "
      style={{
        background:
          "linear-gradient(180deg, #4A78D8 0%, #6B9AE8 32%, #BFE3F2 48%, #6FBE6A 52%, #3E9346 78%, #2C7236 100%)",
        fontFamily: "'Fredoka', sans-serif",
      }}
    >
      {/* ======================= DESKTOP ======================= */}

      <div className="hidden lg:flex h-full flex-col rounded-xl overflow-hidden ">
        <GameHeader
          round={round}
          totalRounds={totalRounds}
          timeLeft={timeLeft}
          word={pokemonName}
          revealedLetters={revealedLetters}
        />

        <div className="flex flex-1 overflow-hidden">
          {/* LEFT PLAYER LIST */}

          <aside
            className="
              w-[270px]
              lg:h-[70%]
              bg-white
              border-r-4
              border-[#244896]
              overflow-hidden
              lg:rounded-bl-md
            "
          >
            <PlayerList players={players} trainerName={state?.trainerName} />
          </aside>

          {/* CENTER */}

          <main className="flex flex-1 flex-col overflow-hidden md:">
            <div className="flex-1 overflow-hidden">
              <PokemonCard
                src={pokemonArtwork}
                revealed={false}
                messages={messages}
                round={round}
                showRoundAnimation={showRoundAnimation}
                types={pokemonTypes}
              />
            </div>
          </main>
          {/* CHAT */}

          <aside
            className="
              w-[355px]
              lg:h-[85%]
              bg-white
              border-l-4
              border-[#244896]
              overflow-hidden
              lg:rounded-br-xl"
          >
            <ChatBox messages={messages} />
            <GuessInput
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              onSubmit={submitGuess}
            />
          </aside>
        </div>
      </div>

      {/* ======================= MOBILE ======================= */}

      <div className="flex lg:hidden flex-col h-full">
        <GameHeader
          round={round}
          totalRounds={totalRounds}
          timeLeft={timeLeft}
          word={pokemonName}
          revealedLetters={revealedLetters}
        />
        <PokemonCard
          src={pokemonArtwork}
          revealed={false}
          messages={messages}
          round={round}
          showRoundAnimation={showRoundAnimation}
          types={pokemonTypes}
        />

        <div className="flex flex-1 min-h-0">
          <div className="w-1/2 border-r border-black/10 bg-white">
            <PlayerList players={players} trainerName={state?.trainerName} />
          </div>

          <div className="w-1/2 bg-white">
            <ChatBox messages={messages} />
          </div>
        </div>

        <GuessInput
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          onSubmit={submitGuess}
        />
      </div>
    </div>
  );
}
