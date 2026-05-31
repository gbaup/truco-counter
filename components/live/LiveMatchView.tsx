"use client";

import { useTranslation } from "react-i18next";
import Suit from "@/components/ui/Suit";
import PaperPanel from "@/components/ui/PaperPanel";
import { Tally } from "@/components/ui/Palito";
import { LiveBadge, LiveDot } from "./LiveBadge";

type LiveMatchViewProps = {
  scoreUs: number;
  scoreThem: number;
  max: number;
  teamUs: string[];
  teamThem: string[];
  scorer: string;
  onExit: () => void;
  onOpenMenu: () => void;
};

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const MenuIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
    <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);
const LockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="15" height="15">
    <rect x="3.5" y="11" width="17" height="10" rx="2" /><path d="M7.5 11V7a4.5 4.5 0 0 1 9 0v4" />
  </svg>
);

function TeamColumn({
  label,
  score,
  roster,
  suit,
  team,
  max,
}: {
  label: string;
  score: number;
  roster: string[];
  suit: "espada" | "basto";
  team: "us" | "them";
  max: number;
}) {
  const colorClass = team === "us" ? "text-us" : "text-them";
  const color = team === "us" ? "var(--color-us)" : "var(--color-them)";
  const half = max / 2;
  const malas = Math.min(score, half);
  const buenas = Math.max(0, score - half);
  return (
    <div className="flex-1 flex flex-col gap-1.5">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5">
          <Suit kind={suit} size={10} color={color} />
          <span className={`${colorClass} font-bold italic text-[15px]`} style={{ fontFamily: "var(--font-crimson-pro), serif" }}>
            {label}
          </span>
        </div>
        <span className={`${colorClass} font-black text-[28px] leading-none tracking-[-0.04em]`} style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>
          {score}
        </span>
      </div>
      <div className="text-[9px] text-text-mute tracking-[0.08em] px-1">{roster.join(" · ").toUpperCase()}</div>
      <PaperPanel className="flex-1">
        <div className="flex-1 flex flex-col items-center gap-1.5 py-1">
          <Tally score={malas} color={color} size={48} />
        </div>
        {malas > 0 && <div className="h-px mx-2 bg-paper-line/50" />}
        <div className="flex-1 flex flex-col items-center gap-1.5 py-1">
          <Tally score={buenas} color={color} size={48} />
        </div>
      </PaperPanel>
    </div>
  );
}

export default function LiveMatchView({
  scoreUs, scoreThem, max, teamUs, teamThem, scorer, onExit, onOpenMenu,
}: LiveMatchViewProps) {
  const { t } = useTranslation();
  return (
    <div className="relative flex h-full w-full min-h-screen flex-col overflow-hidden bg-background text-text">
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse at 50% 22%, color-mix(in srgb, var(--color-danger) 12%, transparent) 0%, transparent 60%)" }}
      />

      <div className="relative flex items-center justify-between px-3.5 pt-14 pb-1">
        <button onClick={onExit} className="flex h-9 w-9 items-center justify-center rounded-full bg-surface border border-border text-text-dim">
          <CloseIcon />
        </button>
        <LiveBadge />
        <button onClick={onOpenMenu} className="relative flex h-9 w-9 items-center justify-center rounded-full bg-surface border border-border text-text">
          <MenuIcon />
          <span className="absolute -top-0.5 -right-0.5">
            <LiveDot size={11} ring />
          </span>
        </button>
      </div>

      <div className="relative px-3.5 pt-0.5 text-center text-[13px] italic text-text-dim" style={{ fontFamily: "var(--font-crimson-pro), serif" }}>
        {t("live.playingTo", { max })
          .split(String(max))
          .flatMap((part, i) =>
            i === 0
              ? [part]
              : [<span key="m" className="not-italic font-bold text-text" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>{max}</span>, part]
          )}
      </div>

      <div className="relative flex flex-1 gap-2.5 px-3.5 pt-2.5">
        <TeamColumn label={t("matchSetup.team1")} score={scoreUs} roster={teamUs} suit="espada" team="us" max={max} />
        <TeamColumn label={t("matchSetup.team2")} score={scoreThem} roster={teamThem} suit="basto" team="them" max={max} />
      </div>

      <div className="relative px-3.5 pb-7 pt-3">
        <div className="flex items-center justify-center gap-2.5 rounded-[14px] border border-border bg-surface px-4 py-3 text-text-dim">
          <LockIcon />
          <span className="text-[13px] italic" style={{ fontFamily: "var(--font-crimson-pro), serif" }}>
            {t("live.watchingHint", { scorer })}
          </span>
        </div>
      </div>
    </div>
  );
}
