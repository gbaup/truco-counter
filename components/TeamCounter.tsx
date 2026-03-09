"use client";

import { useState } from "react";
import { PublicUser } from "@/types/database";
import TallyMarks from "@/components/ui/TallyMarks";
import PlayerChip from "@/components/ui/PlayerChip";

interface TeamCounterProps {
  title: string;
  players: PublicUser[];
  totalScore: number;
  malas: number;
  buenas: number;
  variant: "primary" | "secondary";
  badgePosition: "left" | "right";
}

export default function TeamCounter({
  title,
  players,
  totalScore,
  malas,
  buenas,
  variant,
  badgePosition,
}: TeamCounterProps) {
  const [showPlayers, setShowPlayers] = useState(false);
  const isPrimary = variant === "primary";

  const bgUserColor = isPrimary
    ? "bg-primary-900/20"
    : "bg-secondary-900/20";
  const titleColor = isPrimary ? "text-primary-500" : "text-secondary-500";


  const badgeBgColor = isPrimary ? "bg-primary-500" : "bg-secondary-500";
  const badgePositionClass = badgePosition === "right" ? "-right-3" : "-left-3";

  return (
    <div
      className={`relative flex flex-col items-center rounded-2xl p-2 backdrop-blur-sm md:p-8 h-full ${bgUserColor}`}
    >
      <button
        type="button"
        onClick={() => setShowPlayers((prev) => !prev)}
        className={`mb-2 flex items-center gap-1 text-2xl font-black md:text-3xl ${titleColor} transition-colors hover:brightness-125 cursor-pointer`}
      >
        {title}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className={`h-5 w-5 transition-transform duration-200 ${showPlayers ? "rotate-180" : ""}`}
        >
          <path
            fillRule="evenodd"
            d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      <div
        className="w-full overflow-hidden transition-all duration-300 ease-in-out"
        style={{
          maxHeight: showPlayers ? `${players.length * 40 + 16}px` : "0px",
          opacity: showPlayers ? 1 : 0,
        }}
      >
        <div className="flex flex-wrap justify-center gap-1.5 pb-2">
          {players.map((player) => (
            <PlayerChip
              key={player.id}
              label={player.username}
              variant={variant}
            />
          ))}
        </div>
      </div>

      <div className="w-full flex-1 flex flex-col gap-4">
        <div className="relative flex flex-1 flex-col items-center justify-start rounded-2xl bg-black/20 p-2">
          <TallyMarks score={malas} />
        </div>

        <div
          className={`h-1 w-full rounded-full shadow-inner ${isPrimary ? "bg-primary-500/20" : "bg-secondary-500/20"
            }`}
        />

        <div className="relative flex flex-1 flex-col items-center justify-start rounded-2xl bg-black/20 p-2">
          <TallyMarks score={buenas} />
        </div>
      </div>

      <div
        className={`absolute top-1/2 z-10 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-xs font-bold text-white shadow-lg md:flex ${badgeBgColor} ${badgePositionClass}`}
      >
        {totalScore}
      </div>
    </div>
  );
}
