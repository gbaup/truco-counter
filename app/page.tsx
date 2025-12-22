"use client";

import { useState } from "react";
import MatchSetup from "@/components/MatchSetup";
import MatchCounter from "@/components/MatchCounter";
import { User, MatchState } from "@/types/database";

export default function Home() {
  const [matchState, setMatchState] = useState<MatchState>({
    view: "setup",
    team1: [],
    team2: [],
    maxPoints: 30,
  });

  const startMatch = (team1: User[], team2: User[], maxPoints: number) => {
    setMatchState({
      view: "match",
      team1,
      team2,
      maxPoints,
    });
  };

  const finishMatch = () => {
    setMatchState({
      ...matchState,
      view: "setup",
    });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 p-4 transition-colors dark:bg-zinc-950">
      <header className="mb-12 text-center">
        <h1 className="text-5xl font-black tracking-tighter text-zinc-900 dark:text-white md:text-7xl">
          TRUCO<span className="text-blue-600">PRO</span>
        </h1>
      </header>

      <main className="w-full max-w-5xl flex items-center justify-center">
        {matchState.view === "setup" ? (
          <MatchSetup onStartMatch={startMatch} />
        ) : (
          <MatchCounter
            team1={matchState.team1}
            team2={matchState.team2}
            maxPoints={matchState.maxPoints}
            onFinish={finishMatch}
          />
        )}
      </main>

      <footer className="mt-12 text-sm text-zinc-400">
        © {new Date().getFullYear()} Anotador TrucoPro
      </footer>
    </div>
  );
}
