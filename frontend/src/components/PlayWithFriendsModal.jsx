import { useState } from "react";
import { X, PlusCircle, DoorOpen } from "lucide-react";
import Pokeball from "./Pokeball";
import CreateRoomModal from "./CreateRoomModal";

export default function PlayWithFriendsModal({
  open,
  onClose,
  onCreateRoom,
  onJoinRoom,
}) {
  const [roomId, setRoomId] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  //   if (!open) return null;

  const handleJoin = () => {
    if (!roomId.trim()) return;

    onJoinRoom(roomId.trim().toUpperCase());
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center px-5 transition-all duration-300
  ${
    open
      ? "opacity-100 bg-black/50 backdrop-blur-sm"
      : "opacity-0 pointer-events-none"
  }`}
    >
      <div
        className={`w-full max-w-sm rounded-[28px] p-4
transition-all duration-300 ease-out
${
  open
    ? "scale-100 opacity-100 translate-y-0"
    : "scale-75 opacity-0 translate-y-8"
}`}
        style={{
          background:
            "linear-gradient(180deg,#F1464F 0%,#D42832 60%,#B71F28 100%)",
          border: "3px solid #7A131B",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2
            className="text-white text-xl font-bold"
            style={{
              WebkitTextStroke: "1px #1C2F80",
            }}
          >
            Play With Friends
          </h2>

          <button
            onClick={() => {
              setShowJoin(false);
              setRoomId("");
              onClose();
            }}
            className="w-9 h-9 rounded-full bg-white flex items-center justify-center"
          >
            <X size={18} />
          </button>
        </div>

        <div
          className="rounded-2xl p-5"
          style={{
            background: "linear-gradient(180deg,#FFFDF6 0%,#F9F1D4 100%)",
            border: "3px solid #2B2340",
          }}
        >
          <p className="text-center text-gray-700 font-semibold mb-6">
            Challenge your friends in a Pokémon guessing battle!
          </p>

          {/* Room ID Input */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Enter Room ID"
              maxLength={6}
              onChange={(e) => setRoomId(e.target.value.toUpperCase())}
              className="w-full bg-white text-center tracking-[4px] uppercase font-bold text-gray-800 placeholder-gray-400 rounded-full px-4 py-3 outline-none border-2 border-[#2B2340]/15 shadow-inner focus:ring-2 focus:ring-blue-300 transition"
            />
          </div>

          {/* Join Room */}
          <button
            onClick={() => handleJoin(roomId)}
            className="w-full mb-5 bg-gradient-to-b from-green-400 to-green-500 text-white font-bold rounded-full py-3 flex items-center justify-center gap-2 border-2 border-green-700/40 shadow-[0_5px_0_#1F6B37] active:translate-y-1 active:shadow-[0_1px_0_#1F6B37]"
          >
            <DoorOpen size={18} />
            Join Room
          </button>

          {/* Host Room */}
          <button
            onClick={() => setShowCreateModal(true)}
            className="w-full bg-gradient-to-b from-yellow-300 to-yellow-400 text-yellow-900 font-bold rounded-full py-3 flex items-center justify-center gap-2 border-2 border-yellow-600/40 shadow-[0_5px_0_#B8860B] active:translate-y-1 active:shadow-[0_1px_0_#B8860B]"
          >
            <PlusCircle size={18} />
            Host Room
          </button>

          <div className="flex justify-center mt-6">
            <Pokeball className="w-10 h-10 animate-float" />
          </div>
        </div>
      </div>
      <CreateRoomModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={(settings) => {
          console.log(settings);

          setShowCreateModal(false);

          onCreateRoom(settings);
        }}
      />
    </div>
  );
}
