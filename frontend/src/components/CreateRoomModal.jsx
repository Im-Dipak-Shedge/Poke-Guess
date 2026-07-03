import { X, Check } from "lucide-react";
import { useState } from "react";
import Pokeball from "./Pokeball";

const roundsList = [5, 10, 15, 20];

const generations = [
  { id: 1, label: "Gen I" },
  { id: 2, label: "Gen II" },
  { id: 3, label: "Gen III" },
  { id: 4, label: "Gen IV" },
  { id: 5, label: "Gen V" },
  { id: 6, label: "Gen VI" },
  { id: 7, label: "Gen VII" },
  { id: 8, label: "Gen VIII" },
  { id: 9, label: "Gen IX" },
];

export default function CreateRoomModal({ open, onClose, onCreate }) {
  const [rounds, setRounds] = useState(10);
  const [selectedGens, setSelectedGens] = useState([1]);

  if (!open) return null;

  const toggleGen = (genId) => {
    if (selectedGens.includes(genId)) {
      if (selectedGens.length === 1) return;

      setSelectedGens(selectedGens.filter((g) => g !== genId));
    } else {
      setSelectedGens([...selectedGens, genId]);
    }
  };

  const toggleAll = () => {
    if (selectedGens.length === generations.length) {
      setSelectedGens([1]);
    } else {
      setSelectedGens(generations.map((g) => g.id));
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm px-5">
      <div
        className="w-full max-w-sm sm:max-w-md rounded-[28px] p-4"
        style={{
          background:
            "linear-gradient(180deg,#F1464F 0%,#D42832 60%,#B71F28 100%)",
          border: "3px solid #7A131B",
        }}
      >
        {/* Header */}

        <div className="flex items-center justify-between mb-4">
          <h2
            className="text-white text-2xl font-bold"
            style={{
              WebkitTextStroke: "1px #1C2F80",
            }}
          >
            Create Room
          </h2>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white flex items-center justify-center hover:scale-105 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}

        <div
          className="rounded-[22px] p-4 max-h-[75vh] overflow-y-auto"
          style={{
            background: "linear-gradient(180deg,#FFFDF6 0%,#F8F0D5 100%)",
            border: "3px solid #2B2340",
          }}
        >
          <h3 className="text-center text-gray-700 font-bold mb-4">
            Configure Your Match
          </h3>

          {/* Rounds */}

          <p className="font-bold text-gray-800 mb-2">🎯 Rounds</p>

          <div className="grid grid-cols-4 gap-2 mb-5">
            {roundsList.map((r) => (
              <button
                key={r}
                onClick={() => setRounds(r)}
                className={`rounded-lg py-2 text-sm font-bold border-2 transition-all duration-200
                  ${
                    rounds === r
                      ? "bg-yellow-300 border-yellow-600 scale-105"
                      : "bg-white border-gray-300 hover:bg-yellow-100"
                  }`}
              >
                {r}
              </button>
            ))}
          </div>

          {/* Header */}

          <div className="flex justify-between items-center mb-2">
            <p className="font-bold text-gray-800">🧬 Generations</p>

            <button
              onClick={toggleAll}
              className="text-xs px-3 py-1 rounded-full bg-blue-500 text-white font-bold hover:bg-blue-600 transition"
            >
              {selectedGens.length === generations.length ? "Clear" : "All"}
            </button>
          </div>

          {/* Generation Grid */}

          <div className="grid grid-cols-3 gap-2 mb-5">
            {generations.map((gen) => {
              const selected = selectedGens.includes(gen.id);

              return (
                <button
                  key={gen.id}
                  onClick={() => toggleGen(gen.id)}
                  className={`rounded-lg border-2 py-2 text-sm font-semibold flex items-center justify-center gap-1 transition-all duration-200
                    ${
                      selected
                        ? "bg-green-400 border-green-700 text-white"
                        : "bg-white border-gray-300 hover:bg-green-50"
                    }`}
                >
                  {gen.label}

                  {selected && <Check size={14} />}
                </button>
              );
            })}
          </div>

          {/* Players */}

          <div className="text-center mb-5">
            <span className="text-sm font-semibold text-gray-700">
              👥 Maximum Players:{" "}
              <span className="text-red-600 font-bold">6</span>
            </span>
          </div>

          {/* Create */}

          <button
            onClick={() =>
              onCreate({
                rounds,
                generations: selectedGens,
              })
            }
            className="w-full bg-gradient-to-b from-yellow-300 to-yellow-400 hover:brightness-105 active:translate-y-1 active:shadow-none transition text-yellow-900 font-bold rounded-full py-3 border-2 border-yellow-600 shadow-[0_5px_0_#B8860B]"
          >
            CREATE ROOM
          </button>

          <div className="flex justify-center mt-5">
            <Pokeball className="w-10 h-10 animate-float" />
          </div>
        </div>
      </div>
    </div>
  );
}
