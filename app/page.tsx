"use client";

import { useState } from "react";
import MatchSetup from "@/components/MatchSetup";
import MatchCounter from "@/components/MatchCounter";
import BurgerMenu from "@/components/BurgerMenu";
import { User, MatchState } from "@/types/database";
import { saveMatch } from "@/services/matchService";

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

  const finishMatch = async (result: { score1: number; score2: number }) => {
    const winner_team =
      result.score1 >= matchState.maxPoints
        ? 1
        : result.score2 >= matchState.maxPoints
          ? 2
          : null;

    if (winner_team) {
      try {
        await saveMatch({
          team1: matchState.team1,
          team2: matchState.team2,
          score1: result.score1,
          score2: result.score2,
          winner_team,
        });
      } catch (error) {
        console.error("Failed to save match:", error);
        // Optionally show an error toast here
      }
    }

    setMatchState({
      ...matchState,
      view: "setup",
    });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 p-4 transition-colors dark:bg-zinc-950">
      {matchState.view === "setup" && <BurgerMenu />}
      {matchState.view === "setup" && (
        <header className="mb-4 text-center">
          <h1 className="text-3xl font-black tracking-tighter text-zinc-900 dark:text-white md:text-7xl">
            TRUCO<span className="text-blue-600">PRO</span>
          </h1>
        </header>
      )}

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
    </div>
  );
}
