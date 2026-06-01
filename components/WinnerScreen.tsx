"use client";

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import Suit from "@/components/ui/Suit";

type WinnerScreenProps = {
  winner: "us" | "them";
  scoreUs: number;
  scoreThem: number;
  max: number;
  winners: string[];
  confetti?: boolean;
  onRematch: () => void;
  onExit: () => void;
};

const GOLD = "var(--color-warning)";

function GoldTrophy({ size = 92 }: { size?: number }) {
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <div
        className="absolute rounded-full"
        style={{
          width: size * 1.25, height: size * 1.25,
          background: `radial-gradient(circle, color-mix(in srgb, ${GOLD} 33%, transparent) 0%, transparent 68%)`,
          animation: "winGlow 2.6s ease-in-out infinite",
        }}
      />
      <svg viewBox="0 0 120 124" width={size} height={size} className="relative" style={{ filter: "drop-shadow(0 8px 14px rgba(0,0,0,0.45))" }}>
        <defs>
          <linearGradient id="goldT" x1="0" y1="0" x2="0.25" y2="1">
            <stop offset="0" stopColor="#fbe9b0" /><stop offset="0.42" stopColor="#e8b552" /><stop offset="1" stopColor="#a9741c" />
          </linearGradient>
        </defs>
        <path d="M30 30 C 8 30 8 60 36 62" fill="none" stroke="url(#goldT)" strokeWidth="7" strokeLinecap="round" />
        <path d="M90 30 C 112 30 112 60 84 62" fill="none" stroke="url(#goldT)" strokeWidth="7" strokeLinecap="round" />
        <rect x="25" y="18" width="70" height="9" rx="4.5" fill="url(#goldT)" />
        <path d="M29 27 L91 27 L84 56 Q60 76 36 56 Z" fill="url(#goldT)" />
        <rect x="53" y="72" width="14" height="16" rx="2" fill="url(#goldT)" />
        <path d="M40 88 L80 88 L85 100 L35 100 Z" fill="url(#goldT)" />
        <rect x="30" y="100" width="60" height="10" rx="3.5" fill="url(#goldT)" />
        <path d="M37 29 L51 29 L43 53 Q39 44 37 33 Z" fill="#fff" opacity="0.4" />
      </svg>
    </div>
  );
}

function ScoreSide({ name, score, isWin, suit, color }: { name: string; score: number; isWin: boolean; suit: "espada" | "basto"; color: string }) {
  return (
    <div className="flex flex-1 flex-col items-center gap-1">
      <div className="flex items-center gap-1.5" style={{ color: isWin ? color : "var(--color-text-dim)" }}>
        <Suit kind={suit} size={11} color={isWin ? color : "var(--color-text-mute)"} />
        <span className="italic font-bold text-[14px]" style={{ fontFamily: "var(--font-crimson-pro), serif" }}>{name}</span>
      </div>
      <div className="font-black leading-[0.9] tracking-[-0.04em]" style={{ fontFamily: "var(--font-space-grotesk), sans-serif", fontSize: isWin ? 54 : 44, color: isWin ? color : "var(--color-text-mute)" }}>
        {score}
      </div>
    </div>
  );
}

function FinalScore({ winner, scoreUs, scoreThem, nameUs, nameThem }: { winner: "us" | "them"; scoreUs: number; scoreThem: number; nameUs: string; nameThem: string }) {
  const usWin = winner === "us";
  return (
    <div className="flex w-full items-center">
      <ScoreSide name={nameUs} score={scoreUs} isWin={usWin} suit="espada" color="var(--color-us)" />
      <div className="px-0.5 text-[26px] text-text-mute -translate-y-1.5" style={{ fontFamily: "var(--font-crimson-pro), serif" }}>—</div>
      <ScoreSide name={nameThem} score={scoreThem} isWin={!usWin} suit="basto" color="var(--color-them)" />
    </div>
  );
}

const CONFETTI_SUITS = ["espada", "basto", "oro", "copa"] as const;

function SuitConfetti({ color }: { color: string }) {
  const pieces = useMemo(
    () => {
      const cols = [GOLD, color, "#f3d27a"];
      return Array.from({ length: 16 }, (_, i) => ({
        id: i,
        left: Math.round((i * 6.3 + (i % 3) * 9) % 100),
        suit: CONFETTI_SUITS[i % 4],
        col: cols[i % 3],
        size: 10 + (i % 4) * 4,
        delay: ((i * 0.37) % 3).toFixed(2),
        dur: (2.6 + (i % 5) * 0.5).toFixed(2),
      }));
    },
    [color]
  );
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {pieces.map((p) => (
        <div key={p.id} className="absolute" style={{ top: -20, left: `${p.left}%`, opacity: 0.85, animation: `winFall ${p.dur}s linear ${p.delay}s infinite` }}>
          <Suit kind={p.suit} size={p.size} color={p.col} />
        </div>
      ))}
    </div>
  );
}

const RematchIcon = () => (
  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 0 1 15-6.7L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-15 6.7L3 16" /><path d="M3 21v-5h5" />
  </svg>
);

export default function WinnerScreen({
  winner, scoreUs, scoreThem, max, winners, confetti = true, onRematch, onExit,
}: WinnerScreenProps) {
  const { t } = useTranslation();
  const color = winner === "us" ? "var(--color-us)" : "var(--color-them)";
  const nameUs = t("matchSetup.team1");
  const nameThem = t("matchSetup.team2");
  const teamLabel = winner === "us" ? nameUs : nameThem;
  const diff = Math.abs(scoreUs - scoreThem);

  return (
    <div className="absolute inset-0 flex items-center justify-center px-5">
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 36%, rgba(8,10,9,0.55) 0%, rgba(6,8,7,0.84) 70%)" }} />
      {confetti && <SuitConfetti color={color} />}

      <div
        className="relative w-full overflow-hidden rounded-[26px] border border-border bg-surface px-5.5 pb-5.5 pt-6.5"
        style={{ boxShadow: `0 30px 70px -24px rgba(0,0,0,0.8), 0 0 0 1px color-mix(in srgb, ${color} 12%, transparent)`, animation: "winPop 0.5s cubic-bezier(.2,.9,.3,1.3) both" }}
      >
        <div className="absolute left-[12%] right-[12%] top-0 h-0.5 opacity-80" style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }} />

        <div className="mb-2 flex justify-center" style={{ animation: "winRise 0.5s ease both", animationDelay: "0.05s" }}>
          <GoldTrophy />
        </div>

        <div className="text-center" style={{ animation: "winRise 0.5s ease both", animationDelay: "0.12s" }}>
          <div className="mb-1 text-[11px] font-bold uppercase tracking-[0.22em] text-text-dim" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>
            {t("win.over")}
          </div>
          <div className="text-[34px] font-extrabold leading-none text-text" style={{ fontFamily: "var(--font-crimson-pro), serif" }}>
            {winner === "them" ? t("win.wonByThem") : t("win.wonBy")}<span className="italic" style={{ color }}>{teamLabel}</span>
          </div>
        </div>

        <div className="my-[6px] mt-[18px] border-y border-border px-1.5 pb-3 pt-3.5" style={{ animation: "winRise 0.5s ease both", animationDelay: "0.18s" }}>
          <FinalScore winner={winner} scoreUs={scoreUs} scoreThem={scoreThem} nameUs={nameUs} nameThem={nameThem} />
          <div className="mt-1.5 text-center text-[11px] italic text-text-mute" style={{ fontFamily: "var(--font-crimson-pro), serif" }}>
            {t("win.playedTo", { max, diff })}
          </div>
        </div>

        <div className="mb-[18px] mt-3 flex flex-wrap justify-center gap-1.5" style={{ animation: "winRise 0.5s ease both", animationDelay: "0.24s" }}>
          {winners.map((n) => (
            <span key={n} className="rounded-[9px] px-2.5 py-[5px] text-[12px] font-semibold" style={{ background: `color-mix(in srgb, ${color} 12%, transparent)`, color, border: `1px solid color-mix(in srgb, ${color} 40%, transparent)` }}>
              {n}
            </span>
          ))}
        </div>

        <div className="flex flex-col gap-2.5" style={{ animation: "winRise 0.5s ease both", animationDelay: "0.3s" }}>
          <button
            onClick={onRematch}
            className="relative flex items-center justify-center gap-2 overflow-hidden rounded-[14px] py-[15px] text-[15px] font-bold text-white"
            style={{ background: color, boxShadow: `0 10px 24px -10px ${color}` }}
          >
            <RematchIcon /> {t("win.rematch")}
            <span className="absolute left-0 top-0 h-full w-[35%]" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)", animation: "winShine 3.6s ease-in-out infinite", animationDelay: "1s" }} />
          </button>
          <button onClick={onExit} className="rounded-[14px] border border-border py-3.5 text-[14px] font-semibold text-text-dim">
            {t("win.exit")}
          </button>
        </div>
      </div>
    </div>
  );
}
