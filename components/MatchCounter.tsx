"use client";

import { useState } from "react";
import { User } from "@/types/database";
import TallyMarks from "@/components/TallyMarks";

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
      <div className="grid grid-cols-2 gap-2 md:gap-8 pb-32">
        {/* Team 1 Counter - Nosotros */}
        <div className="relative flex flex-col items-center rounded-2xl bg-blue-600/10 p-2 backdrop-blur-sm dark:bg-blue-900/20 md:p-8">
          <h3 className="mb-2 text-2xl font-black text-blue-500 md:text-3xl">
            Nosotros
          </h3>
          <div className="mb-4 flex flex-wrap justify-center gap-1">
            {team1.map((u) => (
              <span
                key={u.id}
                className="capitalize rounded-full bg-blue-500/20 px-2 py-0.5 text-xs font-medium text-blue-400"
              >
                {u.username}
              </span>
            ))}
          </div>

          <div className="w-full space-y-4">
            {/* Malas */}
            <div className="relative flex min-h-[140px] flex-col items-center justify-center rounded-2xl bg-white/5 p-2 dark:bg-black/20">
              <span className="absolute top-1 left-2 text-[10px] font-bold uppercase tracking-widest text-blue-500/40">
                Malas
              </span>
              <TallyMarks score={team1Split.malas} />
            </div>

            {/* Separator */}
            <div className="h-1 w-full rounded-full bg-blue-500/20 shadow-inner" />

            {/* Buenas */}
            <div className="relative flex min-h-[140px] flex-col items-center justify-center rounded-2xl bg-white/5 p-2 dark:bg-black/20">
              <span className="absolute top-1 left-2 text-[10px] font-bold uppercase tracking-widest text-blue-500/40">
                Buenas
              </span>
              <TallyMarks score={team1Split.buenas} />
            </div>
          </div>

          <div className="absolute top-1/2 -right-3 z-10 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-blue-500 text-xs font-bold text-white shadow-lg md:flex">
            {score1}
          </div>
        </div>

        {/* Team 2 Counter - Ellos */}
        <div className="relative flex flex-col items-center rounded-2xl bg-green-600/10 p-2 backdrop-blur-sm dark:bg-green-900/20 md:p-8">
          <h3 className="mb-2 text-2xl font-black text-green-500 md:text-3xl">
            Ellos
          </h3>
          <div className="mb-4 flex flex-wrap justify-center gap-1">
            {team2.map((u) => (
              <span
                key={u.id}
                className="capitalize rounded-full bg-green-500/20 px-2 py-0.5 text-xs font-medium text-green-400"
              >
                {u.username}
              </span>
            ))}
          </div>

          <div className="w-full space-y-4">
            {/* Malas */}
            <div className="relative flex min-h-[140px] flex-col items-center justify-center rounded-2xl bg-white/5 p-2 dark:bg-black/20">
              <span className="absolute top-1 left-2 text-[10px] font-bold uppercase tracking-widest text-green-500/40">
                Malas
              </span>
              <TallyMarks score={team2Split.malas} />
            </div>

            {/* Separator */}
            <div className="h-1 w-full rounded-full bg-green-500/20 shadow-inner" />

            {/* Buenas */}
            <div className="relative flex min-h-[140px] flex-col items-center justify-center rounded-2xl bg-white/5 p-2 dark:bg-black/20">
              <span className="absolute top-1 left-2 text-[10px] font-bold uppercase tracking-widest text-green-500/40">
                Buenas
              </span>
              <TallyMarks score={team2Split.buenas} />
            </div>
          </div>

          <div className="absolute top-1/2 -left-3 z-10 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-green-500 text-xs font-bold text-white shadow-lg md:flex">
            {score2}
          </div>
        </div>
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
