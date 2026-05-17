"use client";

import { useEffect, useState } from "react";
import { PublicUser } from "@/types/database";
import { getUsers, getUsersVersus } from "@/services/userService";
import SideDrawer from "@/components/SideDrawer";
import UserDropdown from "@/components/UserDropdown";
import VersusResults from "@/components/VersusResults";
import Logo from "@/components/ui/Logo";
import MenuIcon from "@/components/ui/MenuIcon";

interface VersusStats {
  total_matches: number;
  p1_wins: number;
  p2_wins: number;
  draws: number;
}

export default function VersusPage() {
  const [users, setUsers] = useState<PublicUser[]>([]);
  const [player1, setPlayer1] = useState<string>("");
  const [player2, setPlayer2] = useState<string>("");
  const [stats, setStats] = useState<VersusStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    getUsers().then(setUsers);
  }, []);

  useEffect(() => {
    if (player1 && player2 && player1 !== player2) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(true);
      getUsersVersus(player1, player2)
        .then((data) => setStats(data))
        .catch(() => setStats(null))
        .finally(() => setLoading(false));
    } else {
      setStats(null);
    }
  }, [player1, player2]);

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
          rivalidades
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
        {/* Player selectors */}
        <div className="grid grid-cols-2 gap-2.5">
          <UserDropdown
            label="jugador 1"
            value={player1}
            onChange={setPlayer1}
            users={users}
            disabledId={player2}
            variant="us"
            placeholder="elegir"
          />
          <UserDropdown
            label="jugador 2"
            value={player2}
            onChange={setPlayer2}
            users={users}
            disabledId={player1}
            variant="them"
            placeholder="elegir"
          />
        </div>

        {/* Results */}
        <VersusResults
          stats={stats}
          loading={loading}
          p1Name={users.find((u) => u.id === player1)?.username}
          p2Name={users.find((u) => u.id === player2)?.username}
        />
      </main>
    </div>
  );
}
