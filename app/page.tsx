"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { twMerge } from "tailwind-merge";
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
import { useGroupFeatures } from "@/hooks/useGroupFeatures";
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

  const features = useGroupFeatures();

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

  const { t } = useTranslation();

  const [showExitModal, setShowExitModal] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [matchLogOpen, setMatchLogOpen] = useState(false);
  const [transitionAction, setTransitionAction] = useState<"rematch" | "finish" | null>(null);
  const isTransitioning = transitionAction !== null;

  const resolved = resolveWinner(matchState);
  const winner = resolved?.team ?? null;
  const winnerNames = resolved?.usernames ?? [];

  const winnerDataRef = useRef<{
    winner: "us" | "them";
    scoreUs: number;
    scoreThem: number;
    max: number;
    winnerNames: string[];
  } | null>(null);
  if (winner) {
    winnerDataRef.current = {
      winner,
      scoreUs: matchState.score1,
      scoreThem: matchState.score2,
      max: matchState.maxPoints,
      winnerNames,
    };
  }

  const showWinnerScreen = !!winner || isTransitioning;

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
        toast.error(t("common.failedToStartMatch"));
      }
    }
  };

  const handleRematch = async () => {
    if (isTransitioning) return;
    const t1 = matchState.team1;
    const t2 = matchState.team2;
    const max = matchState.maxPoints;
    setTransitionAction("rematch");
    try {
      await finishMatch({ score1: matchState.score1, score2: matchState.score2, status: "finished" });
      await handleStartMatch(t1, t2, max);
    } finally {
      setTransitionAction(null);
    }
  };

  const handleFinish = async () => {
    if (isTransitioning) return;
    setTransitionAction("finish");
    try {
      await finishMatch({ score1: matchState.score1, score2: matchState.score2, status: "finished" });
    } finally {
      setTransitionAction(null);
    }
  };

  const live = features.liveMatch ? (liveData?.live ?? null) : null;
  const liveDot = live !== null;

  const counterBlurred = !!winner || matchLogOpen || isTransitioning;

  return (
    <div className="min-h-screen bg-background">
      <SideDrawer
        isOpen={drawerOpen}
        onToggle={() => setDrawerOpen((v) => !v)}
        onClose={() => setDrawerOpen(false)}
      />

      {matchState.view === "setup" ? (
        live && live.scorer !== me?.username ? (
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
            className={twMerge("transition-[filter] duration-300", counterBlurred && "pointer-events-none")}
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
              showMatchLog={features.pointsLogs}
            />
          </div>
          {features.pointsLogs && (
            <MatchLogSheet
              open={matchLogOpen}
              onClose={() => setMatchLogOpen(false)}
              hands={hands}
              pending={pending}
              live={liveDot}
            />
          )}
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

      {showWinnerScreen && winnerDataRef.current && (
        <div className="fixed inset-0 z-50">
          <WinnerScreen
            winner={winnerDataRef.current.winner}
            scoreUs={winnerDataRef.current.scoreUs}
            scoreThem={winnerDataRef.current.scoreThem}
            max={winnerDataRef.current.max}
            winners={winnerDataRef.current.winnerNames}
            loadingButton={transitionAction === "rematch" ? "rematch" : transitionAction === "finish" ? "exit" : undefined}
            onRematch={handleRematch}
            onExit={handleFinish}
          />
        </div>
      )}
    </div>
  );
}
