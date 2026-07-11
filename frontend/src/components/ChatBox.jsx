import React, { useEffect, useRef } from "react";
import { LogIn, LogOut, Pencil } from "lucide-react";

const typeStyles = {
  guess: {
    row: "bg-white text-[#222]",
    name: "text-[#244896]",
  },

  system: {
    row: "bg-[#DFF8D9] text-[#1C8B26]",
  },

  join: {
    row: "bg-[#E8F9E8] text-[#2FA043]",
  },

  leave: {
    row: "bg-[#FFE3E3] text-[#D22D2D]",
  },
};

export default function ChatBox({ trainerName, messages = [] }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="h-full w-full lg:h-[89%] overflow-y-auto bg-[#F7F7F7]">
      {messages.map((m) => {
        const style = typeStyles[m.type] || typeStyles.guess;

        return (
          <div
            key={m.id}
            className={`
        ${style.row}
        px-2
        py-1.5
        text-[13px]
        lg:text-[15px]
        leading-5
        border-b
        border-black/5
        break-words
      `}
            style={{
              fontFamily: "'Fredoka', sans-serif",
            }}
          >
            {m.name ? (
              <>
                <span
                  className={`font-semibold ${
                    m.name === trainerName
                      ? "text-[#2B6BFF]" // Your messages
                      : "text-black" // Everyone else
                  }`}
                >
                  {m.name}
                </span>
                {": "}
                <span className="font-normal">{m.text}</span>
              </>
            ) : (
              <span className="font-medium">{m.text}</span>
            )}
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}
