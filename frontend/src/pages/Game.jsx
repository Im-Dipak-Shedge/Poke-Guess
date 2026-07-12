import React, { useEffect, useRef, useState } from "react";
import GameHeader from "../components/GameHeader";
import PokemonCard from "../components/PokemonCard";
import PlayerList from "../components/PlayerList";
import ChatBox from "../components/ChatBox";
import GuessInput from "../components/GuessInput";
import { useLocation, useNavigate } from "react-router-dom";
import socket from "../socket";

export default function Game() {
  const navigate = useNavigate();
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

  const [showWinner, setShowWinner] = useState(false);
  const [winner, setWinner] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [showLeaveMenu, setShowLeaveMenu] = useState(false);
  const [correctPlayers, setCorrectPlayers] = useState([]);

  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&display=swap";

    document.head.appendChild(link);

    return () => document.head.removeChild(link);
  }, []);

  //keyboard height
  useEffect(() => {
    if (!window.visualViewport) return;

    const handleResize = () => {
      const keyboard = window.innerHeight - window.visualViewport.height;

      setKeyboardHeight(keyboard > 100 ? keyboard : 0);
    };

    window.visualViewport.addEventListener("resize", handleResize);

    return () => {
      window.visualViewport.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (keyboardHeight > 0) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [keyboardHeight]);

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

    socket.on("game-finished", (data) => {
      setShowScoreboard(false);

      setShowWinner(true);

      setWinner(data.winner);

      setLeaderboard(data.leaderboard);

      setTimeout(() => {
        navigate("/");
      }, 5000);
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

    socket.on("player-left", (data) => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          type: "leave",
          text: `${data.player} left the room`,
        },
      ]);
    });

    socket.on("correct-players", (players) => {
      setCorrectPlayers(players);
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
      socket.off("player-left");
      socket.off("correct-players");
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
          onSettingsClick={() => setShowLeaveMenu(true)}
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
            <PlayerList
              players={players}
              trainerName={state?.trainerName}
              correctPlayers={correctPlayers}
            />
          </aside>

          {/* CENTER */}

          <main className="flex flex-1 flex-col overflow-hidden md:">
            <div className="flex-1 overflow-hidden">
              <PokemonCard
                showWinner={showWinner}
                winner={winner}
                leaderboard={leaderboard}
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
            <ChatBox messages={messages} trainerName={state?.trainerName} />
            <GuessInput
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              onSubmit={submitGuess}
            />
          </aside>
        </div>
      </div>

      {/* ======================= MOBILE ======================= */}

      <div className="flex lg:hidden flex-col h-full pb-16">
        <GameHeader
          round={round}
          totalRounds={totalRounds}
          timeLeft={timeLeft}
          word={pokemonName}
          revealedLetters={revealedLetters}
          onSettingsClick={() => setShowLeaveMenu(true)}
        />
        <PokemonCard
          showWinner={showWinner}
          winner={winner}
          leaderboard={leaderboard}
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
            <PlayerList
              players={players}
              trainerName={state?.trainerName}
              correctPlayers={correctPlayers}
            />
          </div>

          <div className="w-1/2 bg-white">
            <ChatBox messages={messages} trainerName={state?.trainerName} />
          </div>
        </div>

        <div
          className="fixed left-0 right-0 z-50 lg:hidden transition-all duration-200"
          style={{
            bottom: keyboardHeight,
          }}
        >
          <GuessInput
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            onSubmit={submitGuess}
          />
        </div>
      </div>

      {showLeaveMenu && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div
            className="w-[320px] max-w-[90%] rounded-2xl overflow-hidden"
            style={{
              background: "linear-gradient(180deg,#FFFDF6 0%,#F8F0D5 100%)",
              border: "4px solid #244896",
            }}
          >
            {/* Header */}
            <div className="bg-[#E53935] py-3 text-center border-b-4 border-[#B71C1C]">
              <h2 className="text-white font-black text-xl tracking-wide">
                GAME MENU
              </h2>
            </div>

            {/* Body */}
            <div className="px-6 py-6 text-center">
              <div className="text-5xl mb-3">🚪</div>

              <h3 className="font-black text-xl text-[#244896]">Leave Room?</h3>

              <p className="mt-2 text-sm text-[#444]">
                You will disconnect from the current game.
              </p>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowLeaveMenu(false)}
                  className="flex-1 py-2 rounded-xl font-bold bg-gray-200 hover:bg-gray-300"
                >
                  Cancel
                </button>

                <button
                  onClick={() => {
                    socket.disconnect();
                    navigate("/");
                  }}
                  className="flex-1 py-2 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700"
                >
                  Leave
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
