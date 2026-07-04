import { Crown, Copy, Users, Play, LogOut } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import Pokeball from "../components/Pokeball";

export default function Lobby() {
  const navigate = useNavigate();
  const { state } = useLocation();
  console.log(state);

  if (!state || !state.room) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-500 text-white">
        <div className="text-center">
          <h2 className="text-xl font-bold">Room not found</h2>
          <button
            onClick={() => navigate("/")}
            className="mt-4 bg-white text-blue-600 px-5 py-2 rounded-full font-bold"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const { room, isHost } = state;

  const copyRoomCode = async () => {
    try {
      await navigator.clipboard.writeText(room.roomCode);
      alert("Room code copied!");
    } catch {
      alert("Couldn't copy room code.");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-3 py-6"
      style={{
        background:
          "linear-gradient(180deg,#4A78D8 0%,#6B9AE8 35%,#BFE3F2 50%,#6FBE6A 52%,#3E9346 80%,#2C7236 100%)",
      }}
    >
      <div
        className="w-full max-w-sm rounded-[26px] p-3"
        style={{
          background:
            "linear-gradient(180deg,#F1464F 0%,#D42832 60%,#B71F28 100%)",
          border: "3px solid #7A131B",
        }}
      >
        {/* Header */}

        <div className="text-center mb-4">
          <h1
            className="text-2xl font-bold text-white"
            style={{
              WebkitTextStroke: "1px #1C2F80",
            }}
          >
            Waiting Room
          </h1>

          <p className="text-yellow-300 text-xs">
            Waiting for trainers to join...
          </p>
        </div>

        {/* Body */}

        <div
          className="rounded-[22px] p-4"
          style={{
            background: "linear-gradient(180deg,#FFFDF6 0%,#F8F0D5 100%)",
            border: "3px solid #2B2340",
          }}
        >
          {/* Room Code */}

          <div className="mb-4">
            <p className="text-center text-xs text-gray-500 font-semibold">
              ROOM CODE
            </p>

            <button
              onClick={copyRoomCode}
              className="mt-2 w-full bg-white border-2 border-dashed border-gray-400 rounded-xl py-3 flex items-center justify-center gap-2"
            >
              <span className="font-black tracking-[5px] text-xl">
                {room.roomCode}
              </span>

              <Copy size={18} />
            </button>
          </div>

          {/* Match Settings */}

          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="bg-blue-100 rounded-xl p-3 text-center">
              <p className="text-[11px] text-gray-500">Rounds</p>

              <p className="text-xl font-bold">{room.settings.rounds}</p>
            </div>

            <div className="bg-green-100 rounded-xl p-3 text-center">
              <p className="text-[11px] text-gray-500">Generations</p>

              <p className="font-bold text-sm">
                {room.settings.generations.join(", ")}
              </p>
            </div>
          </div>

          {/* Players */}

          <div className="mb-5">
            <div className="flex justify-between items-center mb-2">
              <h2 className="flex items-center gap-2 font-bold">
                <Users size={18} />
                Trainers
              </h2>

              <span className="font-bold text-sm">
                {room.players.length}/{room.maxPlayers}
              </span>
            </div>

            <div className="space-y-2">
              {room.players.map((player, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl border px-3 py-2 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={player.trainerAvatar}
                      alt={player.trainerName}
                      className="w-10 h-10 object-contain"
                    />

                    <div>
                      <p className="font-semibold text-sm">
                        {player.trainerName}
                      </p>

                      <p className="text-xs text-gray-500">
                        Score: {player.score}
                      </p>
                    </div>
                  </div>

                  {player.isHost && (
                    <div className="flex items-center gap-1 text-yellow-600 text-xs font-bold">
                      <Crown size={15} />
                      HOST
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Bottom */}

          {isHost ? (
            <button className="w-full mb-3 bg-gradient-to-b from-green-400 to-green-500 text-white font-bold rounded-full py-3 flex items-center justify-center gap-2 border-2 border-green-700 shadow-[0_5px_0_#1F6B37] active:translate-y-1 active:shadow-none">
              <Play size={18} />
              START GAME
            </button>
          ) : (
            <div className="mb-3 text-center text-sm font-semibold text-gray-600">
              Waiting for host to start...
            </div>
          )}

          <button
            onClick={() => navigate("/")}
            className="w-full bg-red-500 text-white font-bold rounded-full py-3 flex items-center justify-center gap-2"
          >
            <LogOut size={18} />
            Leave Room
          </button>

          <div className="flex justify-center mt-5">
            <Pokeball className="w-9 h-9 animate-float" />
          </div>
        </div>
      </div>
    </div>
  );
}
