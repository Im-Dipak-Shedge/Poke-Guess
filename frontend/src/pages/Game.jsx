import React, { useEffect, useState } from "react";
import GameHeader from "../components/GameHeader";
import PokemonCard from "../components/PokemonCard";
import PlayerList from "../components/PlayerList";
import ChatBox from "../components/ChatBox";
import GuessInput from "../components/GuessInput";

const mockPlayers = [
  {
    id: 1,
    rank: 1,
    name: "Ash",
    points: 2285,
    avatarColor: "#FF6B6B",
  },
  {
    id: 2,
    rank: 2,
    name: "Misty",
    points: 1890,
    avatarColor: "#4ECDC4",
  },
  {
    id: 3,
    rank: 3,
    name: "Brock",
    points: 1650,
    avatarColor: "#F7B267",
  },
  {
    id: 4,
    rank: 4,
    name: "Jessie",
    points: 1325,
    avatarColor: "#C084FC",
  },
  {
    id: 5,
    rank: 5,
    name: "James",
    points: 840,
    avatarColor: "#60A5FA",
  },
  {
    id: 6,
    rank: 6,
    name: "Gary",
    points: 350,
    avatarColor: "#94A3B8",
  },
  {
    id: 7,
    rank: 7,
    name: "Rohan",
    points: 0,
    avatarColor: "#A855F7",
    isYou: true,
  },
];

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
  const [players] = useState(mockPlayers);
  const [messages, setMessages] = useState(mockMessages);
  const [timeLeft, setTimeLeft] = useState(78);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&display=swap";

    document.head.appendChild(link);

    return () => document.head.removeChild(link);
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
      className="h-screen overflow-hidden bg-[#3d67c7] bg-[url('/backgrounds/pokemon-pattern.png')] bg-repeat p-2 lg:p-3"
      style={{ fontFamily: "'Fredoka', sans-serif" }}
    >
      {/* ======================= DESKTOP ======================= */}

      <div className="hidden lg:flex h-full flex-col rounded-xl overflow-hidden shadow-2xl">
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
            "
          >
            <PlayerList players={players} />
          </aside>

          {/* CENTER */}

          <main className="flex flex-1 flex-col bg-white">
            <div className="flex-1 overflow-hidden">
              <PokemonCard src={null} revealed={false} messages={messages} />
            </div>

            <GuessInput
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              onSubmit={submitGuess}
            />
          </main>

          {/* CHAT */}

          <aside
            className="
              w-[355px]
              bg-white
              border-l-4
              border-[#244896]
              overflow-hidden
            "
          >
            <ChatBox messages={messages} />
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
