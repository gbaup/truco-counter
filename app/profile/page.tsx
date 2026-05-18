"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import SideDrawer from "@/components/SideDrawer";
import { getMe, unlinkGoogle } from "@/services/auth";
import { getUserStats } from "@/services/userService";
import { getMatches } from "@/services/matchService";
import { UserStats } from "@/types/database";
import { MatchHistoryItem } from "@/types/match";
import Logo from "@/components/ui/Logo";
import Suit from "@/components/ui/Suit";
import MenuIcon from "@/components/ui/MenuIcon";
import { toast } from "sonner";

export default function ProfilePage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [matches, setMatches] = useState<MatchHistoryItem[]>([]);
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [googleLinked, setGoogleLinked] = useState(false);
  const [unlinking, setUnlinking] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const me = await getMe();
      if (!me) {
        router.replace("/login");
        return;
      }
      setUsername(me.username);
      setUserId(me.userId);

      const params = new URLSearchParams(window.location.search);
      const linkedParam = params.get("linked") === "true";
      const errorParam = params.get("error");

      setGoogleLinked(linkedParam || (me.googleLinked ?? false));

      if (linkedParam) {
        toast.success(t("profile.google.linkedSuccess"));
        router.replace("/profile");
      } else if (errorParam === "google_already_linked") {
        toast.error(t("profile.google.alreadyLinked"));
        router.replace("/profile");
      }

      const [allStats, userMatches] = await Promise.all([
        getUserStats(),
        getMatches(me.userId),
      ]);

      const myStats = allStats.find((s) => s.user_id === me.userId) ?? null;
      setStats(myStats);
      setMatches(userMatches);
      setLoading(false);
    }
    fetchData();
  }, [router, t]);

  async function handleUnlink() {
    setUnlinking(true);
    const result = await unlinkGoogle();
    if (result.success) {
      setGoogleLinked(false);
    } else {
      toast.error(t("profile.google.unlinkError"));
    }
    setUnlinking(false);
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-us border-t-transparent" />
      </div>
    );
  }

  const winRate =
    stats && stats.wins + stats.losses > 0
      ? Math.round((stats.wins / (stats.wins + stats.losses)) * 100)
      : 0;

  // Current winning streak
  let streak = 0;
  for (const m of matches) {
    const userTeam = m.match_participants.find((p) => p.user_id === userId)?.team;
    if (m.winner_team !== null && m.winner_team === userTeam) {
      streak++;
    } else {
      break;
    }
  }

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
            <Link href="/history" className="text-us font-semibold text-[11px]">
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
              const team1Names = match.match_participants
                .filter((p) => p.team === 1)
                .map((p) => p.users?.username)
                .filter(Boolean)
                .join(" · ");
              const team2Names = match.match_participants
                .filter((p) => p.team === 2)
                .map((p) => p.users?.username)
                .filter(Boolean)
                .join(" · ");

              return (
                <div
                  key={match.id}
                  className={[
                    "flex items-center gap-2.5 px-3.5 py-2.5",
                    i < recentMatches.length - 1 ? "border-b border-border" : "",
                  ].join(" ")}
                >
                  {/* G / P mini card */}
                  <div
                    className={[
                      "w-8 h-8 rounded-[7px] flex items-center justify-center shrink-0",
                      won ? "bg-them/20 text-them" : "bg-danger/20 text-danger",
                    ].join(" ")}
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
                    <p className="text-text font-semibold text-xs truncate">
                      {team1Names}
                    </p>
                    <p className="text-caption-italic text-text-dim truncate" style={{ fontSize: 11 }}>
                      vs {team2Names}
                    </p>
                  </div>

                  {/* Score */}
                  <p
                    className={[
                      "font-display font-extrabold text-[17px] shrink-0",
                      won ? "text-them" : "text-danger",
                    ].join(" ")}
                  >
                    {match.score_team_1}–{match.score_team_2}
                  </p>
                </div>
              );
            })
          )}
        </div>
        {/* ── Google account ── */}
        <div className="bg-surface rounded-xl border border-border px-3.5 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" className="shrink-0">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            <div>
              <p
                className="text-caption-italic text-text-mute"
                style={{ fontFamily: "var(--font-crimson-pro), serif", fontSize: 11 }}
              >
                {t("profile.google.title")}
              </p>
              <p className="text-text font-semibold text-xs">
                {googleLinked ? t("profile.google.linked") : t("profile.google.notLinked")}
              </p>
            </div>
          </div>

          {googleLinked ? (
            <button
              onClick={handleUnlink}
              disabled={unlinking}
              className="text-danger font-semibold text-xs border border-danger/30 rounded-lg px-3 py-1.5 disabled:opacity-50 active:scale-[0.97] transition-transform"
            >
              {t("profile.google.unlink")}
            </button>
          ) : (
            <a
              href="/api/auth/google?action=link"
              className="text-us font-semibold text-xs border border-us/30 rounded-lg px-3 py-1.5 active:scale-[0.97] transition-transform"
            >
              {t("profile.google.link")}
            </a>
          )}
        </div>
      </main>
    </div>
  );
}
