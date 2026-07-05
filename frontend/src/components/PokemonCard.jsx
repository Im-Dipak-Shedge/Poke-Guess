import React from "react";

export default function PokemonCard({ src, revealed = false, messages = [] }) {
  const recent = messages.slice(-4);

  return (
    <div className="relative w-full shrink-0 lg:border-0 border-b-2 flex items-center bg-[#ffffff] justify-center h-[35%] lg:h-[85%] lg:rounded-bl-xl">
      {src ? (
        <img
          src={src}
          alt={revealed ? "Pokemon" : "Who's that Pokemon?"}
          draggable={false}
          className="max-h-full max-w-full object-contain select-none"
          style={revealed ? undefined : { filter: "brightness(0)" }}
        />
      ) : (
        <span className="text-[#2B2340]/30 text-xs font-semibold">
          Waiting for next round...
        </span>
      )}

      {recent.length > 0 && (
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
      )}
    </div>
  );
}
