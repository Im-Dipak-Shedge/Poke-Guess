import React from "react";
import Pokeball from "./Pokeball";

export default function GuessInput({
  word,
  revealedLetters,
  value,
  onChange,
  onSubmit,
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="w-full shrink-0 px-2 py-2  lg:rounded-br-lg flex items-center gap-2"
      style={{
        background:
          "linear-gradient(180deg, #F1464F 0%, #D42832 55%, #B8202A 100%)",
        borderTop: "3px solid #7A131B",
      }}
    >
      <div className="relative flex-1">
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
          <Pokeball className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder="Type your guess here..."
          className="w-full bg-white text-gray-800 placeholder-gray-400 text-sm rounded-full pl-9 pr-4 py-2.5 outline-none border-2 border-[#2B2340]/15 shadow-inner focus:ring-2 focus:ring-yellow-300 transition"
        />
      </div>
    </form>
  );
}
