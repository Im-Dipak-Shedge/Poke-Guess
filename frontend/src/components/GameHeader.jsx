import React from "react";
import { Settings } from "lucide-react";
import Pokeball from "./Pokeball";

/**
 * GameHeader
 * Compact top bar: timer + round stacked in one column on the left, word
 * blanks centered, settings on the right. Kept short so mobile keeps most
 * of the screen for the Pokemon card below.
 */
export default function GameHeader({
  round = 1,
  totalRounds = 3,
  timeLeft = 60,
  word = "",
  revealedLetters = [],
  onSettingsClick,
}) {
  const blanks = word
    .split("")
    .map((ch, i) => (ch === " " ? " " : revealedLetters[i] || "_"))
    .join(" ");

  return (
    <div
      className="w-full flex items-center justify-between gap-2 px-2 py-1.5 shrink-0"
      style={{
        background:
          "linear-gradient(180deg, #F1464F 0%, #D42832 55%, #B8202A 100%)",
        borderBottom: "3px solid #7A131B",
      }}
    >
      {/* Timer + round, stacked as one column */}
      <div className="flex flex-col items-center shrink-0 w-14">
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center relative shrink-0"
          style={{
            background: "linear-gradient(180deg, #FFFDF6 0%, #FBF2D6 100%)",
            border: "2px solid #2B2340",
          }}
        >
          <Pokeball className="w-3.5 h-3.5" />
          <span className="absolute -bottom-1 -right-1 bg-yellow-400 text-[#7A131B] text-[8px] font-bold rounded-full min-w-[14px] h-3.5 px-0.5 flex items-center justify-center border border-white">
            {timeLeft}
          </span>
        </div>
        <span
          className="text-white/90 text-[9px] font-semibold whitespace-nowrap mt-0.5"
          style={{ textShadow: "0 1px 0 rgba(0,0,0,0.2)" }}
        >
          Round {round}/{totalRounds}
        </span>
      </div>

      {/* Word blanks, centered and compact */}
      <div className="flex flex-col items-center flex-1 min-w-0">
        <span
          className="text-yellow-300 text-sm font-bold tracking-[0.2em] truncate max-w-full"
          style={{ textShadow: "0 2px 0 rgba(0,0,0,0.25)" }}
        >
          {blanks || "----"}
        </span>
      </div>

      <button
        onClick={onSettingsClick}
        aria-label="Settings"
        className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 hover:brightness-110 active:scale-90 transition"
        style={{
          background: "linear-gradient(180deg, #FFFDF6 0%, #FBF2D6 100%)",
          border: "2px solid #2B2340",
        }}
      >
        <Settings size={13} className="text-[#2B2340]" strokeWidth={2.5} />
      </button>
    </div>
  );
}
