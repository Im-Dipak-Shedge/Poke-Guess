import React from "react";
import Pokeball from "./Pokeball";

export default function PokemonCard({
  src,
  revealed = false,
  messages = [],
  round,
  showRoundAnimation,
  types = [],
}) {
  const recent = messages.slice(-4);

  const typeColors = {
    normal: "bg-[#A8A77A] text-white",
    fire: "bg-[#EE8130] text-white",
    water: "bg-[#6390F0] text-white",
    electric: "bg-[#F7D02C] text-[#3A2E00]",
    grass: "bg-[#7AC74C] text-white",
    ice: "bg-[#96D9D6] text-[#184A45]",
    fighting: "bg-[#C22E28] text-white",
    poison: "bg-[#A33EA1] text-white",
    ground: "bg-[#E2BF65] text-[#5A3D00]",
    flying: "bg-[#A98FF3] text-white",
    psychic: "bg-[#F95587] text-white",
    bug: "bg-[#A6B91A] text-white",
    rock: "bg-[#B6A136] text-white",
    ghost: "bg-[#735797] text-white",
    dragon: "bg-[#6F35FC] text-white",
    dark: "bg-[#705746] text-white",
    steel: "bg-[#B7B7CE] text-[#2B2B2B]",
    fairy: "bg-[#D685AD] text-white",
  };

  return (
    <div
      className="
    relative
    w-full
    h-[35%]
    lg:h-[85%]
    shrink-0
    flex
    flex-col
    overflow-hidden
    lg:rounded-bl-xl
    border
  "
      style={{
        background:
          "linear-gradient(135deg, rgba(135,206,250,0.75) 0%, rgba(96,181,240,0.7) 100%)",
        backdropFilter: "blur(14px) saturate(180%)",
        WebkitBackdropFilter: "blur(14px) saturate(180%)",
        border: "1.5px solid rgba(224,242,254,0.85)",
        boxShadow:
          "inset 0 1.5px 0 rgba(255,255,255,0.75), inset 0 -10px 22px rgba(30,100,180,0.3), 0 6px 18px rgba(90,170,230,0.35)",
      }}
    >
      {/* Glass shine */}
      <div
        className="pointer-events-none absolute -top-8 -left-8 w-40 h-28 rotate-[-25deg]"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.6) 0%, transparent 100%)",
        }}
      />

      {/* Bottom glow */}
      <div
        className="pointer-events-none absolute bottom-0 right-0 w-36 h-24 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(186,230,253,0.55) 0%, transparent 70%)",
        }}
      />

      {/* pokemon image */}
      <div className="flex-[6] flex items-center justify-center overflow-hidden px-4">
        {!showRoundAnimation && src && (
          <img
            src={src}
            alt={revealed ? "Pokemon" : "Who's that Pokémon?"}
            draggable={false}
            className="
            h-full
            w-auto
            max-h-[100%]
            lg:max-h-[85%]
            object-contain
            select-none
      "
            style={revealed ? {} : { filter: "brightness(0)" }}
          />
        )}
      </div>

      {/* Pokémon Types */}
      {!showRoundAnimation && (
        <div
          className="
    flex-[1]
    flex
    items-center
    justify-center
    gap-2
    px-2
    pb-4
  "
        >
          {types.map((type) => (
            <span
              key={type}
              className={`
          px-4 py-1.5
          rounded-full
          text-xs lg:text-sm
          font-extrabold
          uppercase
          tracking-wide
          border-2 border-white/60
          shadow-lg
          ${typeColors[type] || "bg-gray-500 text-white"}
        `}
            >
              {type}
            </span>
          ))}
        </div>
      )}

      {showRoundAnimation && (
        <div className="absolute inset-0 lg:pt-0 pt-10 z-50 flex flex-col items-center justify-center backdrop-blur-sm lg:rounded-bl-xl animate-fade">
          <Pokeball className="w-28 h-28 animate-spin-slow" />

          <h2
            className="mt-6 text-4xl lg:text-5xl font-black text-yellow-300"
            style={{
              WebkitTextStroke: "2px #1C2F80",
              fontFamily: "'Fredoka', sans-serif",
            }}
          >
            ROUND {round}
          </h2>

          <p className="mt-2 text-white text-lg font-bold">Start!</p>
        </div>
      )}
      {/* {recent.length > 0 && (
        <div className="absolute top-2 right-2 flex flex-col items-end gap-1 max-w-[65%]">
          {recent.map((m) => (
            <div
              key={m.id}
              className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-white border border-[#2B2340]/10 text-[#2B2340] shadow-sm truncate max-w-full"
              style={{ fontFamily: "'Fredoka', sans-serif" }}
            >
              {m.name ? `${m.name}: ${m.text}` : m.text}
            </div>
          ))}
        </div>
      )} */}
    </div>
  );
}
