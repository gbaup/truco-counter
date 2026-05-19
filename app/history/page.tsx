"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import SideDrawer from "@/components/SideDrawer";
import MatchList from "@/components/MatchList";
import Logo from "@/components/ui/Logo";
import MenuIcon from "@/components/ui/MenuIcon";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { useMatches } from "@/hooks/useMatches";

export default function HistoryPage() {
  const { t } = useTranslation();
  const { data: matches = [], isPending } = useMatches();
  const [drawerOpen, setDrawerOpen] = useState(false);

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

      <main className="px-5 pb-8">
        <MatchList matches={matches} emptyMessage={t("matchHistory.noMatches")} />
      </main>
    </div>
  );
}
