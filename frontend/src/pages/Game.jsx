import React, { useEffect, useRef, useState } from "react";
import GameHeader from "../components/GameHeader";
import PokemonCard from "../components/PokemonCard";
import PlayerList from "../components/PlayerList";
import ChatBox from "../components/ChatBox";
import GuessInput from "../components/GuessInput";
import { useLocation } from "react-router-dom";
import socket from "../socket";

export default function Game() {
  const { state } = useLocation();
  const [guess, setGuess] = useState("");
  const [messages, setMessages] = useState([]);
  const [timeLeft, setTimeLeft] = useState(state?.gameData?.timeLeft || 10);
  const [round, setRound] = useState(state?.gameData?.round || 1);
  const [showRoundAnimation, setShowRoundAnimation] = useState(true);
  const [pokemonArtwork, setPokemonArtwork] = useState("");
  const [pokemonTypes, setPokemonTypes] = useState([]);
  const [pokemonName, setPokemonName] = useState("");
  const [revealedLetters, setRevealedLetters] = useState([]);
  const [revealed, setRevealed] = useState(false);
  const revealedRef = useRef(false);
  const [totalRounds, setTotalRounds] = useState(
    state?.gameData?.totalRounds || 1,
  );
  const [showScoreboard, setShowScoreboard] = useState(false);
  const [roundScores, setRoundScores] = useState([]);
  const [players, setPlayers] = useState(state?.room?.players || []);
  const hasGuessedRef = useRef(false);

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
      setShowScoreboard(false);
      setRound(data.round);
      setTotalRounds(data.totalRounds);
      setTimeLeft(data.timeLeft);

      setPokemonArtwork(data.artwork);
      setPokemonTypes(data.types);

      setPokemonName(data.pokemonName);
      setRevealedLetters([...data.revealedLetters]);

      setShowRoundAnimation(true);

      setRevealed(false);
      hasGuessedRef.current = false;
      revealedRef.current = false;

      setMessages([]);
      // clears chat everyround

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
      if (hasGuessedRef.current) return;

      setRevealedLetters([...data.revealedLetters]);
    });

    socket.on("guess-message", (data) => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          type: "guess",
          name: data.player,
          text: data.guess,
        },
      ]);
    });

    socket.on("player-guessed", (data) => {
      //tells everyone that someone guessed the pokemon
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          type: "system",
          text: `${data.player} guessed correctly!`,
        },
      ]);
    });

    socket.on("correct-guess", (data) => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          type: "system",
          text: "You guessed correctly!",
        },
      ]);

      setPokemonArtwork(data.artwork);
      setPokemonName(data.pokemonName); // <-- important
      setRevealed(true);
      hasGuessedRef.current = true;
      setRevealedLetters(data.revealedLetters);
    });

    socket.on("round-ended", (data) => {
      setShowScoreboard(true);

      setRoundScores(data.players);

      setPokemonArtwork(data.pokemon.artwork);
      setPokemonTypes(data.pokemon.types);

      setRevealed(true);

      setRevealedLetters(data.pokemon.name.split("").map((_, i) => i));

      setTimeLeft(0);
    });

    return () => {
      socket.off("round-started");
      socket.off("timer-update");
      socket.off("game-finished");
      socket.off("hint-update");
      socket.off("guess-message");
      socket.off("player-guessed");
      socket.off("correct-guess");
      socket.off("round-ended");
    };
  }, []);

  const submitGuess = (e) => {
    e.preventDefault();

    if (!guess.trim()) return;

    socket.emit("guess-pokemon", {
      roomCode: state.room.roomCode,
      guess,
    });

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
                pokemonName={pokemonName}
                showScoreboard={showScoreboard}
                roundScores={roundScores}
                src={pokemonArtwork}
                revealed={revealed}
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
              lg:rounded-br-xl
              "
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
          pokemonName={pokemonName}
          showScoreboard={showScoreboard}
          roundScores={roundScores}
          src={pokemonArtwork}
          revealed={revealed}
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
