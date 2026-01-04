"use client";

import { useState } from "react"; // Solo para UI local como modales
import MatchSetup from "@/components/MatchSetup";
import MatchCounter from "@/components/MatchCounter";
import BurgerMenu from "@/components/BurgerMenu";
import WinnerModal from "@/components/WinnerModal";
import ConfirmationExitModal from "@/components/ConfirmationExitModal";
import { useMatch } from "@/hooks/useMatch";
import { PublicUser } from "@/types/database";


export default function Home() {
  const {
    matchState, isLoaded, isSaving, isStarting,
    startMatch, finishMatch, incrementScore, decrementScore
  } = useMatch();

  const [showExitModal, setShowExitModal] = useState(false);

  const winner = matchState.score1 >= matchState.maxPoints ? "Nosotros" : matchState.score2 >= matchState.maxPoints ? "Ellos" : null;

  if (!isLoaded) return null;

  const handleStartMatch = async (
    t1: PublicUser[],
    t2: PublicUser[],
    max: number
  ) => {
    try {
      await startMatch(t1, t2, max);
    } catch (e: unknown) {
      if (e instanceof Error && e.message === "PLAYERS_BUSY") alert("Jugadores ocupados...");
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 p-4 transition-colors dark:bg-zinc-950">
      {matchState.view === "setup" && <BurgerMenu />}

      {matchState.view === "setup" && (
        <header className="mb-4 text-center">
          <h1 className="text-3xl font-black tracking-tighter text-zinc-900 dark:text-white md:text-7xl">
            TRUCO<span className="text-primary-600">PRO</span>
          </h1>
        </header>
      )}

      <main className="w-full max-w-5xl flex items-center justify-center">
        {matchState.view === "setup" ? (
          <MatchSetup onStartMatch={handleStartMatch} isStarting={isStarting} />
        ) : (
          <>
            <MatchCounter
              {...matchState}
              onIncrement={incrementScore}
              onDecrement={decrementScore}
              onExit={() => setShowExitModal(true)}
            />
            <WinnerModal
              winner={winner}
              onFinish={() => finishMatch({ score1: matchState.score1, score2: matchState.score2, status: "finished" })}
              isLoading={isSaving}
            />
            {showExitModal && (
              <ConfirmationExitModal
                onConfirm={() => {
                  setShowExitModal(false);
                  finishMatch({ score1: matchState.score1, score2: matchState.score2, status: "cancelled" });
                }}
                onCancel={() => setShowExitModal(false)}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}