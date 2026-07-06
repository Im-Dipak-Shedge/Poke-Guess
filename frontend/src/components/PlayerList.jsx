import React from "react";
import { Pencil } from "lucide-react";

export default function PlayerList({ players = [] }) {
  const rankedPlayers = [...players]
    .sort((a, b) => b.score - a.score)
    .map((player, index) => ({
      ...player,
      rank: index + 1,
    }));
  return (
    <div className="h-full w-full flex flex-col overflow-y-auto">
      {rankedPlayers.map((p) => (
        <div
          key={p.id}
          className={`className="h-16 lg:h-18 flex items-center gap-2 px-2 lg:px-4 border-b border-[#2B2340]/20 ${
            p.isCorrect ? "bg-green-400" : p.isYou ? "bg-red-100" : ""
          }`}
        >
          <span
            className="text-[12px] lg:text-[15px] font-bold w-6 shrink-0"
            style={{
              fontFamily: "'Fredoka', sans-serif",
              color: p.isCorrect ? "#0F3D1C" : "rgba(43,35,64,0.7)",
            }}
          >
            #{p.rank}
          </span>

          <div className="flex flex-col leading-tight flex-1 min-w-0">
            <span
              className={`text-[11px] lg:text-[14px] font-semibold truncate ${
                p.isCorrect
                  ? "text-[#0F3D1C]"
                  : p.isYou
                    ? "text-red-600"
                    : "text-[#2B2340]"
              }`}
              style={{ fontFamily: "'Fredoka', sans-serif" }}
            >
              {p.trainerName}
              {p.isYou ? " (You)" : ""}
            </span>
            <span
              className={`text-[10px] lg:text-[12px] font-medium ${
                p.isCorrect ? "text-[#0F3D1C]/80" : "text-[#2B2340]/80"
              }`}
            >
              {p.score} points
            </span>
          </div>

          {p.isDrawing && (
            <Pencil
              size={14}
              className="text-[#2B2340]/70 shrink-0"
              strokeWidth={2.5}
            />
          )}

          <div className="w-10 lg:w-14 h-full flex items-center justify-center shrink-0 overflow-hidden ">
            {p.trainerAvatar ? (
              <img
                src={p.trainerAvatar}
                alt={p.trainerName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-white text-[10px] lg:text-[12px] font-bold">
                {p.trainerName?.[0]?.toUpperCase()}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
