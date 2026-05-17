"use client";

import { PublicUser } from "@/types/database";
import TeamCounter from "./TeamCounter";
import Controls from "./Controls";
import Logo from "@/components/ui/Logo";
import MenuIcon from "@/components/ui/MenuIcon";
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
  onMenuOpen: () => void;
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
  onMenuOpen,
}: MatchCounterProps) {
  const { t } = useTranslation();
  const half = maxPoints / 2;

  const getSplit = (score: number) => ({
    malas: Math.min(score, half),
    buenas: Math.max(0, score - half),
  });

  const team1Split = getSplit(score1);
  const team2Split = getSplit(score2);

  return (
    <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
      {/* Subtle felt overlay — emerald glow at top-center */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, rgba(4, 120, 87, 0.15) 0%, transparent 70%)",
        }}
      />

      {/* Status bar */}
      <div className="relative flex items-center justify-between px-3.5 pt-14 pb-1">
        <span
          className="text-caption-italic text-text-dim"
          style={{ fontFamily: "var(--font-crimson-pro), serif" }}
        >
          {t("matchCounter.playing", { max: maxPoints })}
        </span>

        <Logo size={14} />

        <button
          onClick={onMenuOpen}
          className="w-[30px] h-[30px] rounded-full border border-border text-text-dim flex items-center justify-center transition-colors hover:bg-surface"
          aria-label="Menú"
        >
          <MenuIcon size={14} />
        </button>
      </div>

      {/* Team columns */}
      <div className="relative flex gap-2.5 px-3.5 pt-2 flex-1 min-h-0">
        <TeamCounter
          title={t("matchCounter.team1")}
          players={team1}
          totalScore={score1}
          malas={team1Split.malas}
          buenas={team1Split.buenas}
          variant="primary"
        />
        <TeamCounter
          title={t("matchCounter.team2")}
          players={team2}
          totalScore={score2}
          malas={team2Split.malas}
          buenas={team2Split.buenas}
          variant="secondary"
        />
      </div>

      {/* Controls */}
      <div className="relative">
        <Controls
          onIncrement={onIncrement}
          onDecrement={onDecrement}
          onExit={onExit}
          score1={score1}
          score2={score2}
        />
      </div>
    </div>
  );
}
