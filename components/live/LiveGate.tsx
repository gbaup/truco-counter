"use client";

import { useTranslation } from "react-i18next";
import Logo from "@/components/ui/Logo";
import { MenuIcon } from "@/components/ui/icons";
import { LiveBadge, LiveDot, MiniScore } from "./LiveBadge";

type LiveMatch = {
  scoreUs: number;
  scoreThem: number;
  max: number;
  teamUs: string[];
  teamThem: string[];
};

const EyeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="17" height="17">
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" />
  </svg>
);

export default function LiveGate({ live, onWatch, onMenuOpen }: { live: LiveMatch; onWatch: () => void; onMenuOpen: () => void }) {
  const { t } = useTranslation();
  return (
    <div className="relative flex h-full w-full min-h-screen flex-col overflow-hidden bg-background text-text">
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse at 50% 24%, color-mix(in srgb, var(--color-danger) 11%, transparent) 0%, transparent 60%)" }}
      />

      <div className="relative flex items-center justify-between px-3.5 pt-14 pb-1">
        <span className="text-caption-italic text-text-dim" style={{ fontFamily: "var(--font-crimson-pro), serif" }}>
          {t("nav.setup")}
        </span>
        <Logo size={14} />
        <button
          onClick={onMenuOpen}
          className="relative w-[30px] h-[30px] rounded-full border border-border text-text-dim flex items-center justify-center transition-colors hover:bg-surface"
          aria-label="Menú"
        >
          <MenuIcon size={14} />
          <span className="absolute -top-0.5 -right-0.5">
            <LiveDot size={9} ring />
          </span>
        </button>
      </div>

      <div className="relative flex flex-1 flex-col items-center justify-center gap-3.5 px-6 pb-10">
        <LiveBadge />

        <div className="text-center">
          <div className="text-[26px] font-bold leading-tight text-text" style={{ fontFamily: "var(--font-crimson-pro), serif" }}>
            {t("live.gateHeadline")}
          </div>
          <div className="mt-1 text-[13px] italic text-text-dim" style={{ fontFamily: "var(--font-crimson-pro), serif" }}>
            {t("live.gateSub")}
          </div>
        </div>

        <div className="mt-1.5 flex w-full items-center justify-between px-1.5">
          <div>
            <div className="mb-0.5 text-[11px] font-bold tracking-[0.1em] text-us">{t("matchSetup.team1").toUpperCase()}</div>
            <div className="text-[9px] tracking-[0.06em] text-text-mute">{live.teamUs.join(" · ").toUpperCase()}</div>
          </div>
          <MiniScore us={live.scoreUs} them={live.scoreThem} big />
          <div className="text-right">
            <div className="mb-0.5 text-[11px] font-bold tracking-[0.1em] text-them">{t("matchSetup.team2").toUpperCase()}</div>
            <div className="text-[9px] tracking-[0.06em] text-text-mute">{live.teamThem.join(" · ").toUpperCase()}</div>
          </div>
        </div>
        <div className="text-[12px] italic text-text-dim" style={{ fontFamily: "var(--font-crimson-pro), serif" }}>
          {t("live.playingTo", { max: live.max })}
        </div>

        <button
          onClick={onWatch}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-[14px] bg-danger px-4 py-4 text-[15px] font-bold text-white active:scale-[0.98] transition-transform"
          style={{ boxShadow: "0 10px 24px -12px var(--color-danger)" }}
        >
          <EyeIcon /> {t("live.watch")}
        </button>
      </div>
    </div>
  );
}
