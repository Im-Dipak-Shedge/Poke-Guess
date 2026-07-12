export default function Pokeball({
  className = "w-6 h-6",
  spinning = false,
  style,
}) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={`${className} ${spinning ? "animate-spin-slow" : ""}`}
      style={style}
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Top Half */}
      <path d="M3,32 A29,29 0 0 1 61,32 L61,32 L3,32 Z" fill="#EF4444" />

      {/* Bottom Half */}
      <path d="M3,32 A29,29 0 0 0 61,32 L61,32 L3,32 Z" fill="#FFFFFF" />

      {/* Outer Border */}
      <circle
        cx="32"
        cy="32"
        r="29"
        fill="none"
        stroke="#1B2140"
        strokeWidth="3"
      />

      {/* Middle Band */}
      <rect x="3" y="29" width="58" height="6" fill="#1B2140" />

      {/* Center Button */}
      <circle
        cx="32"
        cy="32"
        r="9"
        fill="#FFFFFF"
        stroke="#1B2140"
        strokeWidth="3.5"
      />

      <circle
        cx="32"
        cy="32"
        r="3.5"
        fill="#FFFFFF"
        stroke="#1B2140"
        strokeWidth="2"
      />
    </svg>
  );
}
