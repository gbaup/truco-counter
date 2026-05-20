"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import SideDrawer from "@/components/SideDrawer";
import Logo from "@/components/ui/Logo";
import Suit from "@/components/ui/Suit";
import MenuIcon from "@/components/ui/MenuIcon";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { useProfileData } from "@/hooks/useProfileData";
import { formatTeamNames } from "@/lib/domain/match";
import { twMerge } from "tailwind-merge";

export default function ProfilePage() {
  const { t } = useTranslation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const profile = useProfileData();

  if (profile.isLoading) return <LoadingScreen />;
  if (!profile.me) return null;

  const { me, stats, matches, winRate, streak } = profile;
  const { userId, username } = me;
  const recentMatches = matches.slice(0, 3);

  return (
    <div className="min-h-screen bg-background text-text">
      <SideDrawer
        isOpen={drawerOpen}
        onToggle={() => setDrawerOpen((v) => !v)}
        onClose={() => setDrawerOpen(false)}
      />

      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-14 pb-3">
        <Logo size={18} />
        <span
          className="text-caption-italic text-text"
          style={{ fontFamily: "var(--font-crimson-pro), serif" }}
        >
          {t("sideDrawer.profile")}
        </span>
        <button
          onClick={() => setDrawerOpen(true)}
          className="w-9 h-9 rounded-lg bg-surface border border-border text-text-dim flex items-center justify-center transition-colors hover:bg-surface-elevated"
          aria-label="Menú"
        >
          <MenuIcon />
        </button>
      </div>

      <main className="flex flex-col gap-3 px-5 pb-8">

        {/* ── Player spotlight card ── */}
        <div
          className="relative rounded-[22px] overflow-hidden shadow-hero"
          style={{
            background:
              "linear-gradient(135deg, var(--color-paper) 0%, var(--color-paper-shade) 100%)",
          }}
        >
          {/* Corner — top-left */}
          <div className="absolute top-3 left-3.5 flex flex-col items-start gap-0.5">
            <span
              className="text-paper-ink leading-none"
              style={{
                fontFamily: "var(--font-crimson-pro), serif",
                fontWeight: 800,
                fontSize: 24,
              }}
            >
              1
            </span>
            <Suit kind="espada" size={14} color="#1A1410" />
          </div>

          {/* Corner — bottom-right (rotated 180°) */}
          <div className="absolute bottom-3 right-3.5 flex flex-col items-end gap-0.5 rotate-180">
            <span
              className="text-paper-ink leading-none"
              style={{
                fontFamily: "var(--font-crimson-pro), serif",
                fontWeight: 800,
                fontSize: 24,
              }}
            >
              1
            </span>
            <Suit kind="espada" size={14} color="#1A1410" />
          </div>

          {/* Centered content */}
          <div className="text-center px-12 py-7">
            <p
              className="text-caption-italic"
              style={{
                color: "rgba(26,20,16,0.6)",
                letterSpacing: "0.18em",
                fontFamily: "var(--font-crimson-pro), serif",
              }}
            >
              {t("profile.label")}
            </p>
            <h2
              className="text-paper-ink capitalize mt-0.5"
              style={{
                fontFamily: "var(--font-crimson-pro), serif",
                fontSize: 30,
                fontWeight: 700,
                lineHeight: 1.1,
              }}
            >
              {username}
            </h2>
            <div className="w-[30px] h-px bg-paper-ink opacity-40 mx-auto my-2" />
            <p
              className="text-caption-italic"
              style={{
                color: "rgba(26,20,16,0.6)",
                letterSpacing: "0.18em",
                fontFamily: "var(--font-crimson-pro), serif",
              }}
            >
              glicko
            </p>
            <p className="text-display-xl font-display text-paper-ink mt-0.5">
              {stats ? Math.round(stats.rating) : "—"}
            </p>
          </div>
        </div>

        {/* ── Stat tiles ── */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-surface border border-border rounded-lg p-3 text-center">
            <p
              className="text-caption-italic text-text-mute"
              style={{ fontFamily: "var(--font-crimson-pro), serif" }}
            >
              {t("profile.wins")}
            </p>
            <p className="text-display-md font-display text-them mt-0.5">
              {stats?.wins ?? "—"}
            </p>
          </div>
          <div className="bg-surface border border-border rounded-lg p-3 text-center">
            <p
              className="text-caption-italic text-text-mute"
              style={{ fontFamily: "var(--font-crimson-pro), serif" }}
            >
              {t("profile.losses")}
            </p>
            <p className="text-display-md font-display text-danger mt-0.5">
              {stats?.losses ?? "—"}
            </p>
          </div>
          <div className="bg-surface border border-border rounded-lg p-3 text-center">
            <p
              className="text-caption-italic text-text-mute"
              style={{ fontFamily: "var(--font-crimson-pro), serif" }}
            >
              {t("profile.winRate")}
            </p>
            <p className="text-display-md font-display text-text mt-0.5">
              {stats ? `${winRate}%` : "—"}
            </p>
          </div>
        </div>

        {/* ── Elo · RD · Racha strip ── */}
        <div className="bg-surface rounded-lg border border-border p-3 flex items-center">
          <div className="flex-1 text-center">
            <p
              className="text-caption-italic text-text-mute"
              style={{ fontFamily: "var(--font-crimson-pro), serif", fontSize: 11 }}
            >
              elo
            </p>
            <p className="font-display font-extrabold text-[18px] text-text">
              {stats ? Math.round(stats.elo_rating) : "—"}
            </p>
          </div>
          <div className="w-px self-stretch bg-border mx-2" />
          <div className="flex-1 text-center">
            <p
              className="text-caption-italic text-text-mute"
              style={{ fontFamily: "var(--font-crimson-pro), serif", fontSize: 11 }}
            >
              {t("profile.rd")}
            </p>
            <p className="font-display font-extrabold text-[18px] text-text-dim">
              {stats ? Math.round(stats.rating_deviation) : "—"}
            </p>
          </div>
          <div className="w-px self-stretch bg-border mx-2" />
          <div className="flex-1 text-center">
            <p
              className="text-caption-italic text-text-mute"
              style={{ fontFamily: "var(--font-crimson-pro), serif", fontSize: 11 }}
            >
              racha
            </p>
            <p className="font-display font-extrabold text-[18px] text-warning">
              {streak || "—"}
            </p>
          </div>
        </div>

        {/* ── Recent matches ── */}
        <div className="bg-surface rounded-xl border border-border overflow-hidden">
          <div className="flex items-center justify-between px-3.5 pt-3.5 pb-2.5">
            <h3
              className="text-heading-sm text-text"
              style={{ fontFamily: "var(--font-crimson-pro), serif" }}
            >
              {t("profile.recent")}
            </h3>
            <Link href={`/history?player=${encodeURIComponent(username)}`} className="text-us font-semibold text-[11px]">
              {t("profile.viewAll")} →
            </Link>
          </div>

          {recentMatches.length === 0 ? (
            <p className="text-caption-italic text-text-mute px-3.5 pb-3.5">
              {t("profile.noMatches")}
            </p>
          ) : (
            recentMatches.map((match, i) => {
              const userTeam = match.match_participants.find(
                (p) => p.user_id === userId
              )?.team;
              const won =
                match.winner_team !== null && match.winner_team === userTeam;
              const opponentTeam = userTeam === 1 ? 2 : 1;
              const myTeamNames = formatTeamNames(match.match_participants, userTeam ?? 1);
              const theirTeamNames = formatTeamNames(match.match_participants, userTeam ? opponentTeam : 2);
              const myScore = userTeam === 2 ? match.score_team_2 : match.score_team_1;
              const theirScore = userTeam === 2 ? match.score_team_1 : match.score_team_2;

              return (
                <div
                  key={match.id}
                  className={twMerge(
                    "flex items-center gap-2.5 px-3.5 py-2.5",
                    i < recentMatches.length - 1 ? "border-b border-border" : "",
                  )}
                >
                  {/* G / P mini card */}
                  <div
                    className={twMerge(
                      "w-8 h-8 rounded-[7px] flex items-center justify-center shrink-0",
                      won ? "bg-them/20 text-them" : "bg-danger/20 text-danger",
                    )}
                    style={{
                      fontFamily: "var(--font-crimson-pro), serif",
                      fontWeight: 800,
                      fontSize: 14,
                    }}
                  >
                    {won ? "G" : "P"}
                  </div>

                  {/* Team names */}
                  <div className="flex-1 min-w-0">
                    <p className="capitalize text-text font-semibold text-xs truncate">
                      {myTeamNames}
                    </p>
                    <p className="capitalize text-caption-italic text-text-dim truncate" style={{ fontSize: 11 }}>
                      VS {theirTeamNames}
                    </p>
                  </div>

                  {/* Score */}
                  <p
                    className={twMerge(
                      "font-display font-extrabold text-[17px] shrink-0",
                      won ? "text-them" : "text-danger",
                    )}
                  >
                    {myScore}–{theirScore}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}
