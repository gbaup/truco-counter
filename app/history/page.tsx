"use client";

import { useMemo, useState, Suspense } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams, useRouter } from "next/navigation";
import SideDrawer from "@/components/SideDrawer";
import MatchList from "@/components/MatchList";
import PlayerFilterPicker from "@/components/ui/PlayerFilterPicker";
import type { RosterEntry } from "@/types/match";
import Logo from "@/components/ui/Logo";
import MenuIcon from "@/components/ui/MenuIcon";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { useMatches } from "@/hooks/useMatches";

export default function HistoryPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <HistoryPageContent />
    </Suspense>
  );
}

function HistoryPageContent() {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: matches = [], isPending } = useMatches();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const filterParam = searchParams.get("player");
  const selectedPlayers = useMemo(() => {
    return filterParam ? filterParam.split(",").filter(Boolean) : [];
  }, [filterParam]);

  function handleFilterChange(players: string[]) {
    const params = new URLSearchParams(searchParams.toString());
    if (players.length > 0) {
      params.set("player", players.join(","));
    } else {
      params.delete("player");
    }
    router.replace(`/history${params.toString() !== "" ? `?${params}` : ""}`);
  }

  const roster = useMemo<RosterEntry[]>(() => {
    const map = new Map<string, RosterEntry>();
    for (const m of matches) {
      for (const p of m.match_participants) {
        const u = p.users;
        if (!u) continue;
        const entry = map.get(u.username);
        if (entry) {
          entry.matchCount += 1;
        } else {
          map.set(u.username, {
            username: u.username,
            name: u.name,
            last_name: u.last_name,
            matchCount: 1,
          });
        }
      }
    }
    return Array.from(map.values()).sort((a, b) =>
      a.username.localeCompare(b.username)
    );
  }, [matches]);

  const filteredMatches = useMemo(() => {
    if (selectedPlayers.length === 0) return matches;
    return matches.filter((m) => {
      const participants = selectedPlayers.map((username) =>
        m.match_participants.find((p) => p.users?.username === username)
      );

      if (participants.some((p) => !p)) return false;
      if (selectedPlayers.length === 1) return true;

      const firstTeam = participants[0]!.team;
      return participants.every((p) => p!.team === firstTeam);
    });
  }, [matches, selectedPlayers]);

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
        selectedPlayers={selectedPlayers}
        matchCount={filteredMatches.length}
        totalMatches={matches.length}
        onFilterChange={handleFilterChange}
      />

      <main className="px-5 pb-8">
        <MatchList
          matches={filteredMatches}
          highlightPlayer={selectedPlayers}
          emptyMessage={
            selectedPlayers.length > 1
              ? t("matchHistory.noFilteredMatchesTogether")
              : selectedPlayers.length === 1
              ? t("matchHistory.noFilteredMatches")
              : t("matchHistory.noMatches")
          }
        />
      </main>
    </div>
  );
}
