import { Crown, Copy, Users, Play, LogOut } from "lucide-react";
import Pokeball from "../components/Pokeball";
import { useLocation } from "react-router-dom";

export default function WaitingRoom() {
  // Dummy data for now
  const { state } = useLocation();

  const { roomId, trainer, trainerImage, settings, isHost } = state;
  const room = {
    roomId,
    rounds: settings.rounds,
    generations: settings.generations,
    players: [
      {
        name: trainer,
        avatar: trainerImage,
        host: true,
      },
    ],
  };

  return (
    <div
      className="min-h-screen flex justify-center items-center px-4 py-6"
      style={{
        background:
          "linear-gradient(180deg,#4A78D8 0%,#6B9AE8 35%,#BFE3F2 50%,#6FBE6A 52%,#3E9346 80%,#2C7236 100%)",
      }}
    >
      <div
        className="w-full max-w-md rounded-[30px] p-4"
        style={{
          background:
            "linear-gradient(180deg,#F1464F 0%,#D42832 60%,#B71F28 100%)",
          border: "3px solid #7A131B",
        }}
      >
        {/* Header */}

        <div className="text-center mb-4">
          <h1
            className="text-3xl font-bold text-white"
            style={{
              WebkitTextStroke: "1px #1C2F80",
            }}
          >
            Waiting Room
          </h1>

          <p className="text-yellow-300 text-sm mt-1">
            Waiting for Trainers...
          </p>
        </div>

        {/* Body */}

        <div
          className="rounded-[25px] p-5"
          style={{
            background: "linear-gradient(180deg,#FFFDF6 0%,#F8F0D5 100%)",
            border: "3px solid #2B2340",
          }}
        >
          {/* Room ID */}

          <div className="mb-5">
            <p className="text-sm text-gray-600 text-center">ROOM CODE</p>

            <button className="w-full mt-2 bg-white rounded-xl py-3 border-2 border-dashed border-gray-400 font-black tracking-[6px] text-xl flex justify-center items-center gap-2">
              {room.roomId}

              <Copy size={18} />
            </button>
          </div>

          {/* Settings */}

          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="bg-blue-100 rounded-xl p-3 text-center">
              <p className="text-xs text-gray-600">Rounds</p>

              <p className="font-bold text-lg">{room.rounds}</p>
            </div>

            <div className="bg-green-100 rounded-xl p-3 text-center">
              <p className="text-xs text-gray-600">Generations</p>

              <p className="font-bold">Gen {room.generations.join(", ")}</p>
            </div>
          </div>

          {/* Players */}

          <div>
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-bold flex items-center gap-2">
                <Users size={18} />
                Trainers
              </h2>

              <span className="font-bold">{room.players.length}/6</span>
            </div>

            <div className="space-y-2">
              {room.players.map((player, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl border p-3 flex justify-between items-center"
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={player.avatar}
                      alt={player.name}
                      className="w-10 h-10 object-contain"
                    />

                    <span className="font-semibold">{player.name}</span>
                  </div>

                  {player.host && (
                    <span className="flex items-center gap-1 text-yellow-600 font-bold text-sm">
                      <Crown size={16} />
                      Host
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Bottom */}

          <div className="mt-6 space-y-3">
            {isHost ? (
              <button className="w-full bg-gradient-to-b from-green-400 to-green-500 text-white font-bold rounded-full py-3 flex justify-center items-center gap-2 border-2 border-green-700 shadow-[0_5px_0_#1F6B37] active:translate-y-1 active:shadow-none">
                <Play size={18} />
                START GAME
              </button>
            ) : (
              <div className="text-center font-semibold text-gray-600">
                Waiting for Host to start...
              </div>
            )}

            <button className="w-full bg-red-500 text-white rounded-full py-3 font-bold flex justify-center items-center gap-2">
              <LogOut size={18} />
              Leave Room
            </button>
          </div>

          <div className="flex justify-center mt-6">
            <Pokeball className="w-10 h-10 animate-float" />
          </div>
        </div>
      </div>
    </div>
  );
}
