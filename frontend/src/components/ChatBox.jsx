import React, { useEffect, useRef } from "react";
import { LogIn, LogOut, Pencil } from "lucide-react";

/**
 * ChatBox
 * Running activity/guess log. Sits in the bottom-right panel next to
 * PlayerList and always sticks to the newest message.
 *
 * messages: [{ id, type: 'drawing' | 'leave' | 'join' | 'system' | 'guess', text, name }]
 */
const typeStyles = {
  drawing: { color: "text-blue-500", Icon: Pencil },
  leave: { color: "text-orange-500", Icon: LogOut },
  join: { color: "text-green-500", Icon: LogIn },
  system: { color: "text-[#2B2340]/70", Icon: null },
  guess: { color: "text-[#2B2340]", Icon: null },
};

export default function ChatBox({ messages = [] }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="h-full w-full flex flex-col gap-1 overflow-y-auto px-2 py-1.5">
      {messages.map((m) => {
        const style = typeStyles[m.type] || typeStyles.system;
        const Icon = style.Icon;
        return (
          <div
            key={m.id}
            className={`text-[11px] font-medium flex items-start gap-1 shrink-0 ${style.color}`}
            style={{ fontFamily: "'Fredoka', sans-serif" }}
          >
            {Icon && (
              <Icon size={12} className="mt-0.5 shrink-0" strokeWidth={2.5} />
            )}
            <span className="break-words">
              {m.name && <span className="font-semibold">{m.name}: </span>}
              {m.text}
            </span>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}
