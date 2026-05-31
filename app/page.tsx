"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import MatchSetup from "@/components/MatchSetup";
import MatchCounter from "@/components/MatchCounter";
import SideDrawer from "@/components/SideDrawer";
import WinnerScreen from "@/components/WinnerScreen";
import ConfirmationExitModal from "@/components/ConfirmationExitModal";
import LiveGate from "@/components/live/LiveGate";
import MatchLogSheet from "@/components/live/MatchLogSheet";
import { useMatch } from "@/hooks/useMatch";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useLiveMatch } from "@/contexts/LiveMatchContext";
import { resolveWinner } from "@/lib/domain/match-display";
import { PublicUser } from "@/types/database";

export default function Home() {
  const router = useRouter();
  const { data: me } = useCurrentUser();
  const { data: liveData } = useLiveMatch();

  useEffect(() => {
    if (me && !me.passwordChanged) {
      router.replace("/change-password");
    }
  }, [me, router]);

  const {
    matchState,
    isLoaded,
    isStarting,
    isFreePlay,
    isGroupsPending,
    startMatch,
    finishMatch,
    incrementScore,
    decrementScore,
    hands,
    pending,
  } = useMatch();

  const [showExitModal, setShowExitModal] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [matchLogOpen, setMatchLogOpen] = useState(false);

  const resolved = resolveWinner(matchState);
  const winner = resolved?.team ?? null;
  const winnerNames = resolved?.names ?? [];

  if (!isLoaded || isGroupsPending) return null;

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
        toast.error("Failed to start match");
      }
    }
  };

  const handleRematch = async () => {
    const t1 = matchState.team1;
    const t2 = matchState.team2;
    const max = matchState.maxPoints;
    await finishMatch({ score1: matchState.score1, score2: matchState.score2, status: "finished" });
    await handleStartMatch(t1, t2, max);
  };

  const live = !isFreePlay ? (liveData?.live ?? null) : null;
  const liveDot = live !== null;

  const counterBlurred = !!winner || matchLogOpen;

  return (
    <div className="min-h-screen bg-background">
      <SideDrawer
        isOpen={drawerOpen}
        onToggle={() => setDrawerOpen((v) => !v)}
        onClose={() => setDrawerOpen(false)}
      />

      {matchState.view === "setup" ? (
        live ? (
          <LiveGate
            live={live}
            onWatch={() => router.push("/live")}
            onMenuOpen={() => setDrawerOpen(true)}
          />
        ) : (
          <MatchSetup
            onStartMatch={handleStartMatch}
            isStarting={isStarting}
            freePlay={isFreePlay}
            onMenuOpen={() => setDrawerOpen(true)}
          />
        )
      ) : (
        <main className="relative w-full min-h-screen">
          <div
            className="transition-[filter] duration-300"
            style={
              counterBlurred
                ? { filter: "blur(7px) saturate(0.9)", transform: "scale(1.06)", transformOrigin: "center" }
                : undefined
            }
          >
            <MatchCounter
              {...matchState}
              onIncrement={incrementScore}
              onDecrement={decrementScore}
              onExit={() => setShowExitModal(true)}
              onMenuOpen={() => setDrawerOpen(true)}
              onMatchLogOpen={() => setMatchLogOpen(true)}
              hands={hands}
              liveDot={liveDot}
            />
          </div>
          {winner && (
            <WinnerScreen
              winner={winner}
              scoreUs={matchState.score1}
              scoreThem={matchState.score2}
              max={matchState.maxPoints}
              winners={winnerNames}
              onRematch={handleRematch}
              onExit={() => finishMatch({ score1: matchState.score1, score2: matchState.score2, status: "finished" })}
            />
          )}
          <MatchLogSheet
            open={matchLogOpen}
            onClose={() => setMatchLogOpen(false)}
            hands={hands}
            pending={pending}
            live={liveDot}
          />
          <ConfirmationExitModal
            open={showExitModal && !winner}
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
