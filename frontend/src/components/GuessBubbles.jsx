import React from "react";

/**
 * GuessBubbles
 * Floating chat bubbles overlaid on the top-right of the canvas, showing the
 * most recent guesses/system messages. Older bubbles fade out, newest is
 * fully opaque — matches the transient "toast" style guess feed.
 *
 * messages: same shape as ChatBox — [{ id, type, name, text }]
 * Only the last `max` messages are shown, most recent at the bottom.
 */
export default function GuessBubbles({ messages = [], max = 5 }) {
  const recent = messages.slice(-max);

  return (
    <div className="pointer-events-none absolute top-2 right-2 flex flex-col items-end gap-1 max-w-[65%]">
      {recent.map((m, i) => {
        const isDrawingNotice =
          m.type === "drawing" || m.type === "join" || m.type === "leave";
        const opacity = 0.35 + (0.65 * (i + 1)) / recent.length;
        return (
          <div
            key={m.id}
            className={`px-2.5 py-1 rounded-full text-[10px] font-semibold shadow-sm truncate max-w-full ${
              isDrawingNotice
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-200/90 text-gray-700"
            }`}
            style={{ opacity, fontFamily: "'Fredoka', sans-serif" }}
          >
            {m.name ? `${m.name}: ${m.text}` : m.text}
          </div>
        );
      })}
    </div>
  );
}
