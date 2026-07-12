import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Users } from "lucide-react";
import PlayWithFriendsModal from "../components/PlayWithFriendsModal";
import Pokeball from "../components/Pokeball";
import { useNavigate } from "react-router-dom";
import CreateRoomModal from "../components/CreateRoomModal";
import { createRoom, joinRoom } from "../api/roomApi";
const trainers = [
  {
    img: "/avatars/trainer1.png",
  },
  {
    img: "/avatars/trainer2.png",
  },
  {
    img: "/avatars/trainer3.png",
  },
  {
    img: "/avatars/trainer4.png",
  },
  {
    img: "/avatars/trainer5.png",
  },
  {
    img: "/avatars/trainer6.png",
  },
  {
    img: "/avatars/trainer7.png",
  },
  {
    img: "/avatars/trainer8.png",
  },
  {
    img: "/avatars/trainer9.png",
  },
  {
    img: "/avatars/trainer10.png",
  },
];

export default function Home() {
  const [index, setIndex] = useState(0);
  const [name, setName] = useState("");
  const [flash, setFlash] = useState(false);
  const [showPlayModal, setShowPlayModal] = useState(false); //to show the play with friends modal
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&display=swap";
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  const go = (dir) => {
    setFlash(true);
    setTimeout(() => {
      setIndex((i) => (i + dir + trainers.length) % trainers.length);
      setFlash(false);
    }, 130);
  };

  const current = trainers[index];

  const requireName = (action) => {
    if (!name.trim()) {
      setStatus("Enter a trainer name first");
      return;
    }
    setStatus(action);
  };

  const floatingBalls = [
    { top: "8%", left: "10%", size: 34, opacity: 0.18, rotate: -12 },
    { top: "14%", left: "82%", size: 44, opacity: 0.16, rotate: 18 },
    { top: "30%", left: "4%", size: 26, opacity: 0.14, rotate: 8 },
    { top: "40%", left: "90%", size: 22, opacity: 0.14, rotate: -20 },
    { top: "78%", left: "8%", size: 30, opacity: 0.2, rotate: 15 },
    { top: "82%", left: "88%", size: 36, opacity: 0.2, rotate: -10 },
  ];

  const handleCreateRoom = async (settings) => {
    try {
      const { data } = await createRoom({
        hostName: name,
        avatar: current.img,
        ...settings, //rounds and generations
      });

      setShowPlayModal(false);

      navigate(`/room/${data.roomCode}`, {
        state: {
          room: data,
          isHost: true,
          trainerName: name,
        },
      });
    } catch (err) {
      alert(err.response?.data?.message || "Couldn't create room");
    }
  };

  const handleJoinRoom = async (roomCode) => {
    try {
      const { data } = await joinRoom(roomCode, name, current.img);

      setShowPlayModal(false);

      navigate(`/room/${data.roomCode}`, {
        state: {
          room: data,
          isHost: false,
          trainerName: name,
        },
      });
    } catch (err) {
      alert(err.response?.data?.message || "Room not found");
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center px-4 py-10 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #4A78D8 0%, #6B9AE8 32%, #BFE3F2 48%, #6FBE6A 52%, #3E9346 78%, #2C7236 100%)",
        fontFamily: "'Fredoka', sans-serif",
      }}
    >
      <div
        className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 w-[520px] h-[560px]"
        style={{
          background:
            "radial-gradient(ellipse at top, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.08) 40%, transparent 65%)",
        }}
      />

      <div
        className="pointer-events-none absolute left-1/2 -translate-x-1/2"
        style={{
          bottom: "8%",
          width: "340px",
          height: "110px",
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.06) 55%, transparent 75%)",
        }}
      />

      <div className="pointer-events-none absolute inset-0">
        {floatingBalls.map((b, i) => (
          <Pokeball
            key={i}
            className="absolute"
            style={{
              top: b.top,
              left: b.left,
              width: b.size,
              height: b.size,
              opacity: b.opacity,
              transform: `rotate(${b.rotate}deg)`,
            }}
          />
        ))}
      </div>

      <div
        className="pointer-events-none absolute inset-0"
        style={{ boxShadow: "inset 0 0 140px 50px rgba(10,20,50,0.28)" }}
      />

      <div className="relative z-10 w-full max-w-[300px] mx-auto flex flex-col items-center">
        <h1
          className="text-4xl font-semibold text-white mb-1 text-center"
          style={{
            WebkitTextStroke: "2px #1C2F80",
            paintOrder: "stroke fill",
            textShadow: "0 4px 0 rgba(0,0,0,0.2)",
          }}
        >
          <span className="text-amber-200">Poke</span>Guess
        </h1>
        <p
          className="text-yellow-300 text-xs font-semibold tracking-widest uppercase mb-6"
          style={{ textShadow: "0 2px 0 rgba(0,0,0,0.25)" }}
        >
          Who's that Pokemon?
        </p>

        <div
          className="w-full rounded-[30px] p-3 shadow-2xl"
          style={{
            background:
              "linear-gradient(180deg, #F1464F 0%, #D42832 55%, #B8202A 100%)",
            border: "3px solid #7A131B",
          }}
        >
          <div className="flex items-center gap-2 px-2 pt-1 pb-3">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center"
              style={{
                background:
                  "radial-gradient(circle at 35% 30%, #EAF6FF 0%, #8FCBFF 35%, #2E7FE0 75%)",
                border: "2px solid #16305E",
                boxShadow: "0 2px 0 rgba(0,0,0,0.25)",
              }}
            >
              <div className="w-2 h-2 rounded-full bg-white/80" />
            </div>
            <div className="flex gap-1.5 ml-auto">
              <span className="w-2 h-2 rounded-full bg-green-300 shadow-[0_0_4px_rgba(134,239,172,0.9)]" />
              <span className="w-2 h-2 rounded-full bg-yellow-300 shadow-[0_0_4px_rgba(253,224,71,0.9)]" />
              <span className="w-2 h-2 rounded-full bg-red-200 shadow-[0_0_4px_rgba(254,202,202,0.9)]" />
            </div>
          </div>

          <div
            className="relative rounded-[22px] p-4 overflow-hidden"
            style={{
              background: "linear-gradient(180deg, #FFFDF6 0%, #FBF2D6 100%)",
              border: "3px solid #2B2340",
            }}
          >
            <div className="relative mb-4">
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <Pokeball className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your trainer name"
                maxLength={16}
                className="w-full bg-white text-gray-800 placeholder-gray-400 text-sm rounded-full pl-10 pr-4 py-2.5 outline-none border-2 border-[#2B2340]/15 shadow-inner focus:ring-2 focus:ring-blue-300 transition"
              />
            </div>

            <div
              className="relative rounded-2xl py-4 px-2 mb-4 flex items-center justify-between overflow-hidden"
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
              <div
                className="pointer-events-none absolute -top-6 -left-6 w-28 h-20 rotate-[-25deg]"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.6) 0%, transparent 100%)",
                }}
              />
              <div
                className="pointer-events-none absolute bottom-0 right-0 w-20 h-14 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, rgba(186,230,253,0.55) 0%, transparent 70%)",
                }}
              />

              <button
                onClick={() => go(-1)}
                aria-label="Previous trainer"
                className="w-9 h-9 rounded-full bg-white text-blue-700 flex items-center justify-center shadow-md hover:bg-yellow-300 active:scale-90 transition shrink-0"
              >
                <ChevronLeft size={18} strokeWidth={3} />
              </button>

              <div className="flex flex-col items-center gap-1 mx-2">
                <img
                  src={current.img}
                  className={`w-28 h-28 object-contain transition-all duration-150 ${
                    flash ? "opacity-0 scale-75" : "opacity-100 scale-100"
                  }`}
                />
              </div>

              <button
                onClick={() => go(1)}
                aria-label="Next trainer"
                className="w-9 h-9 rounded-full bg-white text-blue-700 flex items-center justify-center shadow-md hover:bg-yellow-300 active:scale-90 transition shrink-0"
              >
                <ChevronRight size={18} strokeWidth={3} />
              </button>
            </div>

            <button
              onClick={() => requireName("Searching for a room...")}
              className="w-full bg-gradient-to-b from-yellow-300 to-yellow-400 hover:brightness-105 active:scale-[0.98] transition text-yellow-900 text-sm font-bold uppercase tracking-wide rounded-full py-3 mb-3 flex items-center justify-center gap-2 border-2 border-yellow-600/40 shadow-[0_5px_0_#B8860B] active:shadow-[0_1px_0_#B8860B] active:translate-y-1"
            >
              <Pokeball className="w-4 h-4" />
              Practice
            </button>

            <button
              onClick={() => {
                if (!name.trim()) {
                  setStatus("Enter a trainer name first");
                  return;
                }

                setStatus("");
                setShowPlayModal(true);
              }}
              className="w-full bg-gradient-to-b from-green-400 to-green-500 hover:brightness-105 active:scale-[0.98] transition text-white text-sm font-bold uppercase tracking-wide rounded-full py-3 flex items-center justify-center gap-2 border-2 border-green-700/40 shadow-[0_5px_0_#1F6B37] active:shadow-[0_1px_0_#1F6B37] active:translate-y-1"
            >
              <Users size={16} strokeWidth={2.5} />
              Play With Friends
            </button>
          </div>
        </div>

        <p className="text-white/80 text-xs font-medium mt-4 min-h-[16px] text-center">
          {status}
        </p>
      </div>

      <style>{`
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 3s linear infinite; }
      `}</style>

      <PlayWithFriendsModal
        open={showPlayModal}
        onClose={() => setShowPlayModal(false)}
        onCreateRoom={handleCreateRoom}
        onJoinRoom={handleJoinRoom}
      />
    </div>
  );
}
