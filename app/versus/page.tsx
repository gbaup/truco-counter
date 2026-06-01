"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import SideDrawer from "@/components/SideDrawer";
import UserDropdown from "@/components/UserDropdown";
import VersusResults from "@/components/VersusResults";
import Logo from "@/components/ui/Logo";
import { MenuIcon } from "@/components/ui/icons";
import { useUsers } from "@/hooks/useUsers";
import { useVersusStats } from "@/hooks/useVersusStats";

export default function VersusPage() {
  const { t } = useTranslation();
  const { data: users = [] } = useUsers();
  const [player1, setPlayer1] = useState<string>("");
  const [player2, setPlayer2] = useState<string>("");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { data: stats = null, isLoading: loadingStats } = useVersusStats(player1, player2);

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
          {t("versus.pageLabel")}
        </span>
        <button
          onClick={() => setDrawerOpen(true)}
          className="w-9 h-9 rounded-lg bg-surface border border-border text-text-dim flex items-center justify-center transition-colors hover:bg-surface-elevated"
          aria-label={t("versus.menuAriaLabel")}
        >
          <MenuIcon size={16} />
        </button>
      </div>

      <main className="flex flex-col gap-3 px-5 pb-8">
        {/* Player selectors */}
        <div className="grid grid-cols-2 gap-2.5">
          <UserDropdown
            label={t("versus.player1")}
            value={player1}
            onChange={setPlayer1}
            users={users}
            disabledId={player2}
            variant="us"
            placeholder={t("versus.selectPlaceholder")}
          />
          <UserDropdown
            label={t("versus.player2")}
            value={player2}
            onChange={setPlayer2}
            users={users}
            disabledId={player1}
            variant="them"
            placeholder={t("versus.selectPlaceholder")}
          />
        </div>

        {/* Results */}
        <VersusResults
          stats={stats}
          loading={loadingStats}
          p1Name={users.find((u) => u.id === player1)?.username}
          p2Name={users.find((u) => u.id === player2)?.username}
        />
      </main>
    </div>
  );
}
