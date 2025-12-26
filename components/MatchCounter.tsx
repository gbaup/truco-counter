"use client";

import { useState } from "react";
import { User } from "@/types/database";
import TeamCounter from "./TeamCounter";

interface MatchCounterProps {
  team1: User[];
  team2: User[];
  maxPoints: number;
  onFinish: () => void;
}

export default function MatchCounter({
  team1,
  team2,
  maxPoints,
  onFinish,
}: MatchCounterProps) {
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);

  const increment = (team: 1 | 2) => {
    if (team === 1) {
      if (score1 < maxPoints) setScore1(score1 + 1);
    } else {
      if (score2 < maxPoints) setScore2(score2 + 1);
    }
  };

  const decrement = (team: 1 | 2) => {
    if (team === 1) {
      if (score1 > 0) setScore1(score1 - 1);
    } else {
      if (score2 > 0) setScore2(score2 - 1);
    }
  };

  const winner =
    score1 >= maxPoints ? "Nosotros" : score2 >= maxPoints ? "Ellos" : null;

  const half = maxPoints / 2;

  const getSplitScore = (score: number) => {
    const malas = Math.min(score, half);
    const buenas = Math.max(0, score - half);
    return { malas, buenas };
  };

  const team1Split = getSplitScore(score1);
  const team2Split = getSplitScore(score2);

  return (
    <div className="w-full max-w-5xl">
      <div className="grid grid-cols-2 gap-2 md:gap-8 pb-32 min-h-[calc(100vh-1rem)]">
        <TeamCounter
          title="Nosotros"
          players={team1}
          totalScore={score1}
          malas={team1Split.malas}
          buenas={team1Split.buenas}
          variant="blue"
          badgePosition="right"
        />

        <TeamCounter
          title="Ellos"
          players={team2}
          totalScore={score2}
          malas={team2Split.malas}
          buenas={team2Split.buenas}
          variant="green"
          badgePosition="left"
        />
      </div>

      {/* Fixed Bottom Navbar Controls */}
      <div className="fixed bottom-0 left-0 z-50 w-full border-t border-white/10 bg-zinc-950/80 p-4 backdrop-blur-lg">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          {/* Team 1 Controls */}
          <div className="flex flex-1 items-center justify-center gap-4">
            <button
              onClick={() => decrement(1)}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-xl font-bold text-blue-500 transition-all active:scale-90"
            >
              -
            </button>
            <div className="flex flex-col items-center">
              <span className="text-xl font-black text-blue-500">{score1}</span>
            </div>
            <button
              onClick={() => increment(1)}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-xl font-bold text-white shadow-lg transition-all active:scale-110"
            >
              +
            </button>
          </div>

          <div className="h-8 w-px bg-white/10" />

          {/* Team 2 Controls */}
          <div className="flex flex-1 items-center justify-center gap-4">
            <button
              onClick={() => decrement(2)}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-xl font-bold text-green-500 transition-all active:scale-90"
            >
              -
            </button>
            <div className="flex flex-col items-center">
              <span className="text-xl font-black text-green-500">
                {score2}
              </span>
            </div>
            <button
              onClick={() => increment(2)}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500 text-xl font-bold text-white shadow-lg transition-all active:scale-110"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Winner Confirmation Modal */}
      {winner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="w-full max-w-sm rounded-3xl bg-zinc-900 border border-white/10 p-8 text-center shadow-2xl">
            <div className="mb-4 text-6xl">🏆</div>
            <h2 className="mb-2 text-3xl font-black text-white">
              ¡Ganó {winner}!
            </h2>
            <p className="mb-8 text-zinc-400">Tremendo partido. ¿Revancha?</p>
            <button
              onClick={onFinish}
              className="w-full rounded-2xl bg-blue-600 py-4 font-bold text-white transition-all hover:bg-blue-700 active:scale-95"
            >
              Terminar y Salir
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
