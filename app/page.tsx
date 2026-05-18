"use client";

import { useState } from "react";
import { toast } from "sonner";
import MatchSetup from "@/components/MatchSetup";
import MatchCounter from "@/components/MatchCounter";
import SideDrawer from "@/components/SideDrawer";
import WinnerModal from "@/components/WinnerModal";
import ConfirmationExitModal from "@/components/ConfirmationExitModal";
import { useMatch } from "@/hooks/useMatch";
import { PublicUser } from "@/types/database";

export default function Home() {
  const {
    matchState,
    isLoaded,
    isSaving,
    isStarting,
    startMatch,
    finishMatch,
    incrementScore,
    decrementScore,
  } = useMatch();

  const [showExitModal, setShowExitModal] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const winner =
    matchState.score1 >= matchState.maxPoints
      ? "Nosotros"
      : matchState.score2 >= matchState.maxPoints
        ? "Ellos"
        : null;

  if (!isLoaded) return null;

  const handleStartMatch = async (
    t1: PublicUser[],
    t2: PublicUser[],
    max: number
  ) => {
    try {
      await startMatch(t1, t2, max);
    } catch (e: unknown) {
      if (e instanceof Error) {
        toast.error(e.message);
      } else {
        toast.error("Error al iniciar el partido");
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SideDrawer
        isOpen={drawerOpen}
        onToggle={() => setDrawerOpen((v) => !v)}
        onClose={() => setDrawerOpen(false)}
      />

      {matchState.view === "setup" ? (
        <MatchSetup
          onStartMatch={handleStartMatch}
          isStarting={isStarting}
          onMenuOpen={() => setDrawerOpen(true)}
        />
      ) : (
        <main className="w-full">
          <MatchCounter
            {...matchState}
            onIncrement={incrementScore}
            onDecrement={decrementScore}
            onExit={() => setShowExitModal(true)}
            onMenuOpen={() => setDrawerOpen(true)}
          />
          <WinnerModal
            winner={winner}
            onFinish={() =>
              finishMatch({
                score1: matchState.score1,
                score2: matchState.score2,
                status: "finished",
              })
            }
            isLoading={isSaving}
          />
          {showExitModal && (
            <ConfirmationExitModal
              onConfirm={() => {
                setShowExitModal(false);
                finishMatch({
                  score1: matchState.score1,
                  score2: matchState.score2,
                  status: "cancelled",
                });
              }}
              onCancel={() => setShowExitModal(false)}
            />
          )}
        </main>
      )}
    </div>
  );
}
