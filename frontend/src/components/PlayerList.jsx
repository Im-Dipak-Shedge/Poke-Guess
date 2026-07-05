import React from "react";
import { Pencil } from "lucide-react";

/**
 * PlayerList
 * Scoreboard panel. Rows stretch evenly to fill the full panel height.
 * Green = guessed correctly this round, red tint = you, matching the
 * PokeGuess red/gold palette instead of blue.
 *
 * players: [{ id, rank, name, points, avatar, avatarColor, isDrawing, isYou, isCorrect }]
 */
export default function PlayerList({ players = [] }) {
  return (
    <div className="h-full w-full flex flex-col overflow-y-auto">
      {players.map((p) => (
        <div
          key={p.id}
          className={`flex-1 min-h-[44px] flex  items-center gap-2 px-2 border-b border-[#2B2340]/10 ${
            p.isCorrect ? "bg-green-400" : p.isYou ? "bg-red-100" : ""
          }`}
        >
          <span
            className="text-[11px] lg:text-[14px] font-bold w-6 shrink-0"
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
              {p.name}
              {p.isYou ? " (You)" : ""}
            </span>
            <span
              className={`text-[10px] lg:text-[12px] font-medium ${
                p.isCorrect ? "text-[#0F3D1C]/80" : "text-[#2B2340]/60"
              }`}
            >
              {p.points} points
            </span>
          </div>

          {p.isDrawing && (
            <Pencil
              size={14}
              className="text-[#2B2340]/70 shrink-0"
              strokeWidth={2.5}
            />
          )}

          <div
            className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 overflow-hidden border-2"
            style={{
              backgroundColor: p.avatarColor || "#D42832",
              borderColor: "#2B2340",
            }}
          >
            {p.avatar ? (
              <img
                src={p.avatar}
                alt={p.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-white text-[10px] lg:text-[12px] font-bold">
                {p.name?.[0]?.toUpperCase()}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
