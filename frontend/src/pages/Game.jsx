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
  const [guess, setGuess] = useState("");
  const [messages, setMessages] = useState(mockMessages);
  const [timeLeft, setTimeLeft] = useState(78);
  const { state } = useLocation();

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

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((t) => (t > 0 ? t - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
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
          round={2}
          totalRounds={3}
          timeLeft={timeLeft}
          word="________"
          revealedLetters={[]}
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
            <PlayerList players={players} />
          </aside>

          {/* CENTER */}

          <main className="flex flex-1 flex-col overflow-hidden md:">
            <div className="flex-1 overflow-hidden">
              <PokemonCard src={null} revealed={false} messages={messages} />
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
          round={2}
          totalRounds={3}
          timeLeft={timeLeft}
          word="________"
          revealedLetters={[]}
        />

        <PokemonCard src={null} revealed={false} messages={messages} />

        <div className="flex flex-1 min-h-0">
          <div className="w-1/2 border-r border-black/10 bg-white">
            <PlayerList players={players} />
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
