"use client";

import { useState } from "react";
import { PublicUser } from "@/types/database";
import TeamCounter from "./TeamCounter";
import Controls from "./Controls";
import WinnerModal from "./WinnerModal";
import ConfirmationExitModal from "./ConfirmationExitModal";

interface MatchCounterProps {
  team1: PublicUser[];
  team2: PublicUser[];
  maxPoints: number;
  score1: number;
  score2: number;
  onIncrement: (team: 1 | 2) => void;
  onDecrement: (team: 1 | 2) => void;
  onFinish: (result: { score1: number; score2: number }) => void;
}

export default function MatchCounter({
  team1,
  team2,
  maxPoints,
  score1,
  score2,
  onIncrement,
  onDecrement,
  onFinish,
}: MatchCounterProps) {
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);

  const handleExitClick = () => {
    setShowExitConfirmation(true);
  };

  const handleConfirmExit = () => {
    setShowExitConfirmation(false);
    onFinish({ score1, score2 });
  };

  const handleCancelExit = () => {
    setShowExitConfirmation(false);
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
      <div className="grid grid-cols-2 gap-2 md:gap-8 pb-32 min-h-[calc(100vh-1rem)]">
        <TeamCounter
          title="Nosotros"
          players={team1}
          totalScore={score1}
          malas={team1Split.malas}
          buenas={team1Split.buenas}
          variant="blue"
          badgePosition="right"
        />

        <TeamCounter
          title="Ellos"
          players={team2}
          totalScore={score2}
          malas={team2Split.malas}
          buenas={team2Split.buenas}
          variant="green"
          badgePosition="left"
        />
      </div>

      {/* Fixed Bottom Navbar Controls */}
      <Controls
        onIncrement={onIncrement}
        onDecrement={onDecrement}
        onExit={handleExitClick}
        score1={score1}
        score2={score2}
      />

      {/* Winner Confirmation Modal */}
      <WinnerModal
        winner={winner}
        onFinish={() => onFinish({ score1, score2 })}
      />

      {/* Exit Confirmation Modal */}
      {showExitConfirmation && (
        <ConfirmationExitModal
          onConfirm={handleConfirmExit}
          onCancel={handleCancelExit}
        />
      )}
    </div>
  );
}
