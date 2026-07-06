import React from "react";
import Pokeball from "./Pokeball";

export default function PokemonCard({
  src,
  revealed = false,
  messages = [],
  round,
  showRoundAnimation,
}) {
  const recent = messages.slice(-4);

  return (
    // < className="relative w-full shrink-0 lg:border-0 border-b-2 flex items-center bg-[#ffffff] justify-center h-[35%] lg:h-[85%] lg:rounded-bl-xl">
    <div
      className="
    relative
    w-full
    h-[35%]
    lg:h-[85%]
    shrink-0
    flex
    items-center
    justify-center
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

      {/* Your existing content goes here */}
      {src ? (
        <img
          src={src}
          alt={revealed ? "Pokemon" : "Who's that Pokemon?"}
          draggable={false}
          className="max-h-full max-w-full object-contain select-none"
          style={revealed ? undefined : { filter: "brightness(0)" }}
        />
      ) : (
        <span></span>
      )}

      {showRoundAnimation && (
        <div className="absolute inset-0 lg:pt-0 pt-10 z-50 flex flex-col items-center justify-center backdrop-blur-sm lg:rounded-bl-xl animate-fade">
          <Pokeball className="w-28 h-28 animate-spin-slow" />

          <h2
            className="mt-6 text-5xl font-black text-yellow-300"
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
