"use client";

import { useState, useEffect } from "react";
import MatchSetup from "@/components/MatchSetup";
import MatchCounter from "@/components/MatchCounter";
import BurgerMenu from "@/components/BurgerMenu";
import { PublicUser } from "@/types/database";
import { MatchState } from "@/types/game";
import { saveMatch } from "@/services/matchService";

const STORAGE_KEY = "truco-match-state";

export default function Home() {
  const [matchState, setMatchState] = useState<MatchState>({
    view: "setup",
    team1: [],
    team2: [],
    maxPoints: 30,
    score1: 0,
    score2: 0,
  });

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      try {
        setMatchState(JSON.parse(savedState));
      } catch (error) {
        console.error("Failed to parse saved match state", error);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(matchState));
    }
  }, [matchState, isLoaded]);

  const startMatch = (
    team1: PublicUser[],
    team2: PublicUser[],
    maxPoints: number
  ) => {
    setMatchState({
      view: "match",
      team1,
      team2,
      maxPoints,
      score1: 0,
      score2: 0,
    });
  };

  const handleIncrement = (team: 1 | 2) => {
    if (team === 1) {
      if (matchState.score1 < matchState.maxPoints) {
        setMatchState((prev) => ({ ...prev, score1: prev.score1 + 1 }));
      }
    } else {
      if (matchState.score2 < matchState.maxPoints) {
        setMatchState((prev) => ({ ...prev, score2: prev.score2 + 1 }));
      }
    }
  };

  const handleDecrement = (team: 1 | 2) => {
    if (team === 1) {
      if (matchState.score1 > 0) {
        setMatchState((prev) => ({ ...prev, score1: prev.score1 - 1 }));
      }
    } else {
      if (matchState.score2 > 0) {
        setMatchState((prev) => ({ ...prev, score2: prev.score2 - 1 }));
      }
    }
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
      }
    }

    const resetState: MatchState = {
      view: "setup",
      team1: [],
      team2: [],
      maxPoints: 30,
      score1: 0,
      score2: 0,
    };

    setMatchState(resetState);
    localStorage.removeItem(STORAGE_KEY);
  };

  if (!isLoaded) return null; // Or a loading spinner

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
            score1={matchState.score1}
            score2={matchState.score2}
            onIncrement={handleIncrement}
            onDecrement={handleDecrement}
            onFinish={finishMatch}
          />
        )}
      </main>
    </div>
  );
}
