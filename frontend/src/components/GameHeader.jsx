import React from "react";
import { Settings } from "lucide-react";

export default function GameHeader({
  round,
  totalRounds,
  timeLeft,
  word,
  revealedLetters,
  onSettingsClick,
}) {
  console.log(word);

  const blanks = word
    .split("")
    .map((ch, i) => {
      if (ch === " ") return " ";
      if (ch === "-") return "-";

      return revealedLetters.includes(i) ? ch.toUpperCase() : "_";
    })
    .join(" ");
  return (
    <div
      className="w-full flex items-center justify-between gap-2 lg:px-5 px-2 py-1.5 shrink-0"
      style={{
        background:
          "linear-gradient(180deg, #F1464F 0%, #D42832 55%, #B8202A 100%)",
        borderBottom: "3px solid #7A131B",
      }}
    >
      {/* Timer + round, stacked as one column */}
      <div className="flex flex-col items-center shrink-0">
        <div className="relative flex h-11 w-11 sm:h-14 sm:w-14 items-center justify-center">
          <div className="absolute inset-[5px] rounded-full bg-[#FFFDF7] border-2 border-black" />

          {/* Timer */}
          <span
            className={`relative z-10 text-sm sm:text-lg font-extrabold leading-none tabular-nums ${
              timeLeft <= 15 ? "text-red-600 animate-pulse" : "text-[#2B2340]"
            }`}
            style={{ fontFamily: "'Fredoka', sans-serif" }}
          >
            {timeLeft}
          </span>
        </div>

        <span
          className="mt-1 text-[10px] sm:text-xs font-bold text-white"
          style={{ fontFamily: "'Fredoka', sans-serif" }}
        >
          Round {round}/{totalRounds}
        </span>
      </div>

      {/* Word blanks, centered and compact */}
      <div className="flex flex-1 justify-center items-center px-2 overflow-hidden">
        <span
          className="
      text-yellow-300
      font-black
      text-sm
      lg:text-xl
      tracking-[0.08em]
      lg:tracking-[0.18em]
      text-center
      whitespace-nowrap
    "
          style={{
            textShadow: "0 2px 0 rgba(0,0,0,.25)",
            fontFamily: "'Fredoka', sans-serif",
          }}
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
