"use client";

import { twMerge } from "tailwind-merge";
import { PublicUser } from "@/types/database";
import Suit, { SuitKind } from "@/components/ui/Suit";
import PaperPanel from "@/components/ui/PaperPanel";
import { Tally } from "@/components/ui/Palito";

interface TeamCounterProps {
  title: string;
  players: PublicUser[];
  totalScore: number;
  malas: number;
  buenas: number;
  variant: "primary" | "secondary";
}

export default function TeamCounter({
  title,
  players,
  totalScore,
  malas,
  buenas,
  variant,
}: TeamCounterProps) {
  const isUs = variant === "primary";
  const color = isUs ? "#8B5CF6" : "#34D399";
  const suitKind: SuitKind = isUs ? "espada" : "basto";
  const colorClass = isUs ? "text-us" : "text-them";

  return (
    <div className="flex flex-col gap-1.5 flex-1 min-w-0">
      {/* Team header: suit + label left, score right */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5">
          <Suit kind={suitKind} size={10} color={color} />
          <span
            className={twMerge("text-heading-sm", colorClass)}
            style={{ fontFamily: "var(--font-crimson-pro), serif" }}
          >
            {title}
          </span>
        </div>
        <span
          className={twMerge("text-display-lg font-display", colorClass)}
        >
          {totalScore}
        </span>
      </div>

      {/* Player names — compact overline */}
      <div className="text-label-overline text-text-mute px-1 truncate">
        {players.map((p) => p.username).join(" · ").toUpperCase()}
      </div>

      {/* Paper panel — palitos live here */}
      <PaperPanel className="flex-1 min-h-0">
        {/* Malas (first half) */}
        <div className="flex flex-col items-center gap-1.5 py-1">
          <Tally score={malas} color={color} size={48} gap={6} />
        </div>

        {/* Divider — only visible when malas section has points */}
        {malas > 0 && (
          <div
            className="mx-2 my-0.5 opacity-50"
            style={{ height: 1, background: "var(--color-paper-line)" }}
          />
        )}

        {/* Buenas (second half) */}
        <div className="flex flex-col items-center gap-1.5 py-1">
          <Tally score={buenas} color={color} size={48} gap={6} />
        </div>
      </PaperPanel>
    </div>
  );
}
