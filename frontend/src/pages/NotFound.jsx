import { useNavigate } from "react-router-dom";
import Pokeball from "../components/Pokeball";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #4A78D8 0%, #6B9AE8 32%, #BFE3F2 48%, #6FBE6A 52%, #3E9346 78%, #2C7236 100%)",
        fontFamily: "'Fredoka', sans-serif",
      }}
    >
      {/* Background glow */}
      <div
        className="absolute inset-0"
        style={{
          boxShadow: "inset 0 0 140px 50px rgba(10,20,50,0.28)",
        }}
      />

      {/* Floating Pokeballs */}
      {[...Array(6)].map((_, i) => (
        <Pokeball
          key={i}
          className="absolute opacity-20 animate-spin-slow"
          style={{
            width: `${25 + i * 6}px`,
            height: `${25 + i * 6}px`,
            top: `${10 + i * 13}%`,
            left: `${i % 2 === 0 ? 8 : 82}%`,
          }}
        />
      ))}

      <div
        className="relative z-10 w-full max-w-md rounded-[30px] p-4"
        style={{
          background:
            "linear-gradient(180deg, #F1464F 0%, #D42832 55%, #B8202A 100%)",
          border: "3px solid #7A131B",
        }}
      >
        <div
          className="rounded-[22px] p-8 text-center"
          style={{
            background: "linear-gradient(180deg,#FFFDF6 0%,#FBF2D6 100%)",
            border: "3px solid #2B2340",
          }}
        >
          <Pokeball className="w-24 h-24 mx-auto animate-spin-slow" />

          <h1
            className="mt-6 text-7xl font-black text-yellow-300"
            style={{
              WebkitTextStroke: "3px #1C2F80",
            }}
          >
            404
          </h1>

          <h2 className="mt-3 text-2xl font-black text-[#244896]">
            Who's That Page?
          </h2>

          <p className="mt-3 text-gray-700 text-sm leading-relaxed">
            Looks like this page fled into the tall grass.
            <br />
            Let's get you back to the Pokédex.
          </p>

          <button
            onClick={() => navigate("/")}
            className="mt-8 w-full bg-gradient-to-b from-yellow-300 to-yellow-400 hover:brightness-105 active:scale-[0.98] transition text-yellow-900 text-sm font-bold uppercase tracking-wide rounded-full py-3 border-2 border-yellow-600/40 shadow-[0_5px_0_#B8860B] active:shadow-[0_1px_0_#B8860B] active:translate-y-1"
          >
            Return Home
          </button>
        </div>
      </div>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .animate-spin-slow {
          animation: spin-slow 6s linear infinite;
        }
      `}</style>
    </div>
  );
}
