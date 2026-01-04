"use client";


import { PublicUser } from "@/types/database";
import TeamCounter from "./TeamCounter";
import Controls from "./Controls";
import { useTranslation } from "react-i18next";

interface MatchCounterProps {
  team1: PublicUser[];
  team2: PublicUser[];
  maxPoints: number;
  score1: number;
  score2: number;
  onIncrement: (team: 1 | 2) => void;
  onDecrement: (team: 1 | 2) => void;
  onExit: () => void;
}

export default function MatchCounter({
  team1,
  team2,
  maxPoints,
  score1,
  score2,
  onIncrement,
  onDecrement,
  onExit,
}: MatchCounterProps) {
  const { t } = useTranslation();
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
          title={t("matchCounter.team1")}
          players={team1}
          totalScore={score1}
          malas={team1Split.malas}
          buenas={team1Split.buenas}
          variant="primary"
          badgePosition="right"
        />

        <TeamCounter
          title={t("matchCounter.team2")}
          players={team2}
          totalScore={score2}
          malas={team2Split.malas}
          buenas={team2Split.buenas}
          variant="secondary"
          badgePosition="left"
        />
      </div>

      <Controls
        onIncrement={onIncrement}
        onDecrement={onDecrement}
        onExit={onExit}
        score1={score1}
        score2={score2}
      />
    </div>
  );
}
