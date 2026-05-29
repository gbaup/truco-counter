"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import MatchSetup from "@/components/MatchSetup";
import MatchCounter from "@/components/MatchCounter";
import SideDrawer from "@/components/SideDrawer";
import WinnerModal from "@/components/WinnerModal";
import ConfirmationExitModal from "@/components/ConfirmationExitModal";
import { useMatch } from "@/hooks/useMatch";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { PublicUser } from "@/types/database";

export default function Home() {
  const router = useRouter();
  const { data: me } = useCurrentUser();

  // Self-registered users always have passwordChanged=true, so this redirect never fires for them.
  useEffect(() => {
    if (me && !me.passwordChanged) {
      router.replace("/change-password");
    }
  }, [me, router]);

  const {
    matchState,
    isLoaded,
    isSaving,
    isStarting,
    isFreePlay,
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
      {!isFreePlay && (
        <SideDrawer
          isOpen={drawerOpen}
          onToggle={() => setDrawerOpen((v) => !v)}
          onClose={() => setDrawerOpen(false)}
        />
      )}

      {matchState.view === "setup" ? (
        <MatchSetup
          onStartMatch={handleStartMatch}
          isStarting={isStarting}
          freePlay={isFreePlay}
          onMenuOpen={isFreePlay ? undefined : () => setDrawerOpen(true)}
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
            open={!!winner}
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
          <ConfirmationExitModal
            open={showExitModal}
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
        </main>
      )}
    </div>
  );
}
