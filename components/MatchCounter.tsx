"use client";

import { useState } from "react";
import { User } from "@/types/database";

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
    score1 >= maxPoints ? "Equipo 1" : score2 >= maxPoints ? "Equipo 2" : null;

  return (
    <div className="w-full max-w-4xl space-y-8">
      {winner && (
        <div className="animate-bounce text-center">
          <h2 className="text-4xl font-extrabold text-yellow-500">
            🏆 ¡Ganó el {winner}!
          </h2>
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Team 1 Counter */}
        <div className="relative overflow-hidden rounded-3xl bg-blue-600/10 p-12 text-center backdrop-blur-sm dark:bg-blue-900/20">
          <h3 className="mb-2 text-2xl font-bold text-blue-500">Nosotros</h3>
          <div className="mb-4 flex flex-wrap justify-center gap-2">
            {team1.map((u) => (
              <span
                key={u.id}
                className="capitalize rounded-full bg-blue-500/20 px-3 py-1 text-sm font-medium text-blue-400"
              >
                {u.username}
              </span>
            ))}
          </div>
          <div className="text-8xl font-black text-blue-600 dark:text-blue-400">
            {score1}
          </div>
          <div className="mt-8 flex justify-center gap-6">
            <button
              onClick={() => decrement(1)}
              className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-3xl font-bold transition-all hover:bg-white/20 dark:bg-black/20 dark:hover:bg-black/40"
            >
              -
            </button>
            <button
              onClick={() => increment(1)}
              className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500 text-3xl font-bold text-white shadow-lg transition-all hover:bg-blue-600 hover:scale-105 active:scale-95"
            >
              +
            </button>
          </div>
        </div>

        {/* Team 2 Counter */}
        <div className="relative overflow-hidden rounded-3xl bg-green-600/10 p-12 text-center backdrop-blur-sm dark:bg-green-900/20">
          <h3 className="mb-2 text-2xl font-bold text-green-500">Ellos</h3>
          <div className="mb-4 flex flex-wrap justify-center gap-2">
            {team2.map((u) => (
              <span
                key={u.id}
                className="capitalize rounded-full bg-green-500/20 px-3 py-1 text-sm font-medium text-green-400"
              >
                {u.username}
              </span>
            ))}
          </div>
          <div className="text-8xl font-black text-green-600 dark:text-green-400">
            {score2}
          </div>
          <div className="mt-8 flex justify-center gap-6">
            <button
              onClick={() => decrement(2)}
              className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-3xl font-bold transition-all hover:bg-white/20 dark:bg-black/20 dark:hover:bg-black/40"
            >
              -
            </button>
            <button
              onClick={() => increment(2)}
              className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-500 text-3xl font-bold text-white shadow-lg transition-all hover:bg-green-600 hover:scale-105 active:scale-95"
            >
              +
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-center pt-8">
        <button
          onClick={onFinish}
          className="rounded-full bg-zinc-800 px-12 py-4 font-bold text-white transition-all hover:bg-zinc-950 dark:bg-zinc-200 dark:text-zinc-900 dark:hover:bg-white"
        >
          Terminar Partido
        </button>
      </div>
    </div>
  );
}
