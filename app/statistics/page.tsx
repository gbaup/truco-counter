"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import SideDrawer from "@/components/SideDrawer";
import PaperPanel from "@/components/ui/PaperPanel";
import Suit from "@/components/ui/Suit";
import Logo from "@/components/ui/Logo";
import { UserStats } from "@/types/database";
import { MenuIcon } from "@/components/ui/icons";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { UserRole } from "@/types/auth";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useUserStats } from "@/hooks/useUserStats";
import { queryKeys } from "@/hooks/queryKeys";
import { glickoScore, classicScore } from "@/lib/domain/ratings";
import { twMerge } from "tailwind-merge";

type Tab = "glicko" | "elo" | "classic";

export default function StatisticsPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { data: userStats = [], isPending: statsLoading } = useUserStats();
  const { data: me, isPending: meLoading } = useCurrentUser();
  const [tab, setTab] = useState<Tab>("glicko");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<"idle" | "success" | "error">("idle");

  if (statsLoading || meLoading) return <LoadingScreen />;

  const currentUserId = me?.userId ?? null;
  const currentUserRole = me?.role as UserRole | undefined;

  const sorted =
    tab === "glicko"
      ? [...userStats].sort((a, b) => glickoScore(b.rating, b.rating_deviation) - glickoScore(a.rating, a.rating_deviation))
      : tab === "elo"
        ? [...userStats].sort((a, b) => b.elo_rating - a.elo_rating)
        : [...userStats].sort((a, b) => classicScore(b.wins, b.losses) - classicScore(a.wins, a.losses));

  const top = sorted[0] ?? null;

  const tabDescription =
    tab === "glicko"
      ? t("statistics.glickoDescription")
      : tab === "elo"
        ? t("statistics.eloDescription")
        : t("statistics.classicDescription");

  const displayScore = (s: UserStats) => {
    if (tab === "glicko") return Math.round(glickoScore(s.rating, s.rating_deviation));
    if (tab === "elo") return Math.round(s.elo_rating);
    return classicScore(s.wins, s.losses);
  };

  const ratingLabel = tab === "classic" ? "Pts" : "Rating";

  async function handleSync() {
    setSyncing(true);
    setSyncStatus("idle");
    try {
      const res = await fetch("/api/admin/sync-ratings", { method: "POST" });
      if (!res.ok) throw new Error("Failed");
      queryClient.invalidateQueries({ queryKey: queryKeys.userStats() });
      setSyncStatus("success");
    } catch {
      setSyncStatus("error");
    } finally {
      setSyncing(false);
    }
  }

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
          {t("sideDrawer.statistics")}
        </span>
        <button
          onClick={() => setDrawerOpen(true)}
          className="w-9 h-9 rounded-lg bg-surface border border-border text-text-dim flex items-center justify-center transition-colors hover:bg-surface-elevated"
          aria-label="Menú"
        >
          <MenuIcon size={16} />
        </button>
      </div>

      <main className="flex flex-col gap-3 px-5 pb-8">

        {/* Tab switcher */}
        <div className="bg-surface rounded-md border border-border p-1 flex gap-1">
          {(["glicko", "elo", "classic"] as Tab[]).map((t_) => (
            <button
              key={t_}
              onClick={() => setTab(t_)}
              className={twMerge(
                "flex-1 py-2 rounded-sm text-sm font-semibold transition-colors",
                tab === t_
                  ? "bg-us text-white"
                  : "text-text-dim hover:text-text",
              )}
              style={{ fontFamily: "var(--font-space-grotesk), system-ui" }}
            >
              {t_ === "glicko" ? "Glicko" : t_ === "elo" ? "Elo" : "Clásico"}
            </button>
          ))}
        </div>

        {/* Description */}
        <p
          className="text-caption-italic text-text-mute px-0.5"
          style={{ fontFamily: "var(--font-crimson-pro), serif" }}
        >
          {tabDescription}
        </p>

        {/* Top-1 spotlight */}
        {top && (
          <PaperPanel lines={false}>
            <div className="flex items-center gap-3">
              {/* Mini Spanish card */}
              <div
                className="shrink-0 rounded-[6px] flex flex-col items-center justify-between py-1.5 px-1"
                style={{
                  width: 50,
                  height: 64,
                  background: "var(--color-paper-ink)",
                }}
              >
                <span
                  className="leading-none"
                  style={{
                    fontFamily: "var(--font-crimson-pro), serif",
                    fontWeight: 800,
                    fontSize: 16,
                    color: "var(--color-paper)",
                  }}
                >
                  1
                </span>
                <Suit kind="espada" size={18} color="var(--color-paper)" />
                <span
                  className="leading-none rotate-180"
                  style={{
                    fontFamily: "var(--font-crimson-pro), serif",
                    fontWeight: 800,
                    fontSize: 16,
                    color: "var(--color-paper)",
                  }}
                >
                  1
                </span>
              </div>

              {/* Name + record */}
              <div className="flex-1 min-w-0">
                <p
                  className="text-caption-italic"
                  style={{
                    color: "rgba(26,20,16,0.6)",
                    fontFamily: "var(--font-crimson-pro), serif",
                    fontSize: 11,
                    letterSpacing: "0.12em",
                  }}
                >
                  {t("statistics.topPlayer")}
                </p>
                <p
                  className="text-paper-ink capitalize font-bold truncate"
                  style={{
                    fontFamily: "var(--font-crimson-pro), serif",
                    fontSize: 20,
                    lineHeight: 1.15,
                  }}
                >
                  {top.username}
                </p>
                <p
                  className="text-caption-italic mt-0.5"
                  style={{ color: "rgba(26,20,16,0.55)", fontSize: 12 }}
                >
                  {top.wins}W · {top.losses}L
                </p>
              </div>

              {/* Rating */}
              <div className="shrink-0 text-right">
                <p
                  className="text-paper-ink leading-none"
                  style={{
                    fontFamily: "var(--font-space-grotesk), system-ui",
                    fontWeight: 900,
                    fontSize: 30,
                  }}
                >
                  {displayScore(top)}
                </p>
                <p
                  className="text-label-overline mt-1"
                  style={{ color: "rgba(26,20,16,0.5)", fontSize: 9 }}
                >
                  {tab === "glicko" ? "GLICKO" : tab === "elo" ? "ELO" : "PTS"}
                </p>
              </div>
            </div>
          </PaperPanel>
        )}

        {/* Leaderboard */}
        <div className="bg-surface rounded-xl border border-border overflow-hidden">
          {/* Header row */}
          <div
            className="grid px-3.5 py-2.5 border-b border-border"
            style={{ gridTemplateColumns: "28px 1fr 32px 32px 60px" }}
          >
            <span className="text-label-overline text-text-mute italic">#</span>
            <span className="text-label-overline text-text-mute italic">{t("statistics.table.player")}</span>
            <span className="text-label-overline text-text-mute italic text-center">W</span>
            <span className="text-label-overline text-text-mute italic text-center">L</span>
            <span className="text-label-overline text-text-mute italic text-right">{ratingLabel}</span>
          </div>

          {/* Data rows */}
          {sorted.map((s, i) => (
            <div
              key={s.user_id}
              className={twMerge(
                "grid items-center px-3.5 py-2.5 border-b border-border last:border-0",
                s.user_id === currentUserId ? "bg-us/5" : "",
              )}
              style={{ gridTemplateColumns: "28px 1fr 32px 32px 60px" }}
            >
              <span className="text-text-mute text-[13px]">{i + 1}</span>
              <span className="text-text font-medium text-[13px] truncate capitalize">{s.username}</span>
              <span className="text-them font-bold text-[13px] text-center">{s.wins}</span>
              <span className="text-danger font-bold text-[13px] text-center">{s.losses}</span>
              <span
                className="text-right font-extrabold text-[15px]"
                style={{ fontFamily: "var(--font-space-grotesk), system-ui" }}
              >
                {displayScore(s)}
              </span>
            </div>
          ))}
        </div>

        {/* Admin sync */}
        {currentUserRole === UserRole.admin && (
          <div className="flex flex-col items-end gap-1 pt-1">
            <button
              onClick={handleSync}
              disabled={syncing}
              className="text-xs text-text-dim border border-border rounded-md px-3 py-1.5 hover:bg-surface transition-colors disabled:opacity-50"
              style={{ fontFamily: "var(--font-space-grotesk), system-ui" }}
            >
              {syncing ? "…" : t("statistics.syncButton")}
            </button>
            {syncStatus === "success" && (
              <span className="text-xs text-them">{t("statistics.syncSuccess")}</span>
            )}
            {syncStatus === "error" && (
              <span className="text-xs text-danger">{t("statistics.syncError")}</span>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
