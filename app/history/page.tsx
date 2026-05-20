"use client";

import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "next/navigation";
import SideDrawer from "@/components/SideDrawer";
import MatchList from "@/components/MatchList";
import PlayerFilterPicker, { RosterEntry } from "@/components/ui/PlayerFilterPicker";
import Logo from "@/components/ui/Logo";
import MenuIcon from "@/components/ui/MenuIcon";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { useMatches } from "@/hooks/useMatches";

export default function HistoryPage() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const { data: matches = [], isPending } = useMatches();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filter, setFilter] = useState<string | null>(
    searchParams.get("player") ?? null
  );

  const roster = useMemo<RosterEntry[]>(() => {
    const counts = new Map<string, number>();
    for (const m of matches) {
      for (const p of m.match_participants) {
        const name = p.users?.username;
        if (name) counts.set(name, (counts.get(name) ?? 0) + 1);
      }
    }
    return Array.from(counts.entries())
      .map(([username, matchCount]) => ({ username, matchCount }))
      .sort((a, b) => a.username.localeCompare(b.username));
  }, [matches]);

  const filteredMatches = useMemo(() => {
    if (!filter) return matches;
    return matches.filter((m) =>
      m.match_participants.some((p) => p.users?.username === filter)
    );
  }, [matches, filter]);

  if (isPending) return <LoadingScreen />;

  return (
    <div className="min-h-screen bg-background text-text">
      <SideDrawer
        isOpen={drawerOpen}
        onToggle={() => setDrawerOpen((v) => !v)}
        onClose={() => setDrawerOpen(false)}
      />
      <div className="flex items-center justify-between px-5 pt-14 pb-3">
        <Logo size={18} />
        <span
          className="text-caption-italic text-text"
          style={{ fontFamily: "var(--font-crimson-pro), serif" }}
        >
          {t("sideDrawer.history")}
        </span>
        <button
          onClick={() => setDrawerOpen(true)}
          className="w-9 h-9 rounded-lg bg-surface border border-border text-text-dim flex items-center justify-center transition-colors hover:bg-surface-elevated"
          aria-label="Menú"
        >
          <MenuIcon />
        </button>
      </div>

      <PlayerFilterPicker
        roster={roster}
        filter={filter}
        matchCount={filteredMatches.length}
        totalMatches={matches.length}
        onFilterChange={setFilter}
      />

      <main className="px-5 pb-8">
        <MatchList
          matches={filteredMatches}
          emptyMessage={
            filter
              ? t("matchHistory.noFilteredMatches")
              : t("matchHistory.noMatches")
          }
        />
      </main>
    </div>
  );
}
