"use client";

import { useEffect, useState } from "react";
import { PublicUser } from "@/types/database";
import { getUsers } from "@/services/userService";
import { twMerge } from "tailwind-merge";
import { Button } from "./ui/Button";
import { useTranslation } from "react-i18next";

interface MatchSetupProps {
  onStartMatch: (team1: PublicUser[], team2: PublicUser[], maxPoints: number) => void;
  isStarting: boolean;
}

export default function MatchSetup({ onStartMatch, isStarting }: MatchSetupProps) {
  const [users, setUsers] = useState<PublicUser[]>([]);
  const [team1, setTeam1] = useState<PublicUser[]>([]);
  const [team2, setTeam2] = useState<PublicUser[]>([]);
  const [maxPoints, setMaxPoints] = useState<number>(40);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    async function fetchUsers() {
      const data = await getUsers();
      setUsers(data);
      setLoading(false);
    }
    fetchUsers();
  }, []);

  const toggleUserInTeam = (user: PublicUser, team: 1 | 2) => {
    if (team === 1) {
      if (team1.find((u) => u.id === user.id)) {
        setTeam1(team1.filter((u) => u.id !== user.id));
      } else if (team1.length < 3 && !team2.find((u) => u.id === user.id)) {
        setTeam1([...team1, user]);
      }
    } else {
      if (team2.find((u) => u.id === user.id)) {
        setTeam2(team2.filter((u) => u.id !== user.id));
      } else if (team2.length < 3 && !team1.find((u) => u.id === user.id)) {
        setTeam2([...team2, user]);
      }
    }
  };

  const canStart = team1.length === team2.length && team1.length >= 2;
  const showWarning =
    team1.length !== team2.length && team1.length > 0 && team2.length > 0;

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl space-y-8 rounded-2xl bg-zinc-900/50 p-8 shadow-2xl backdrop-blur-md">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-primary-500">{t("matchSetup.team1")}</h3>
          <div className="max-h-60 overflow-y-auto space-y-2 rounded-xl bg-white/5 p-4">
            {users.map((user) => (
              <button
                key={user.id}
                onClick={() => toggleUserInTeam(user, 1)}
                className={twMerge(
                  "capitalize w-full rounded-lg px-4 py-2 text-left transition-all",
                  team1.find((u) => u.id === user.id)
                    ? "bg-primary-500 text-white"
                    : "hover:bg-white/10",
                  "disabled:opacity-30 disabled:cursor-not-allowed"
                )}
                disabled={!!team2.find((u) => u.id === user.id) || user.isPlaying}
              >
                {user.username}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-secondary-500">{t("matchSetup.team2")}</h3>
          <div className="max-h-60 overflow-y-auto space-y-2 rounded-xl bg-white/5 p-4">
            {users.map((user) => (
              <button
                key={user.id}
                onClick={() => toggleUserInTeam(user, 2)}
                className={twMerge(
                  "capitalize w-full rounded-lg px-4 py-2 text-left transition-all",
                  team2.find((u) => u.id === user.id)
                    ? "bg-secondary-500 text-white"
                    : "hover:bg-white/10",
                  "disabled:opacity-30 disabled:cursor-not-allowed"
                )}
                disabled={!!team1.find((u) => u.id === user.id) || user.isPlaying}
              >
                {user.username}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-center text-xl font-semibold">{t("matchSetup.maxPoints")}</h3>
        <div className="flex justify-center gap-4">
          {[20, 30, 40, 50].map((points) => (
            <button
              key={points}
              onClick={() => setMaxPoints(points)}
              className={twMerge(
                "h-12 w-12 rounded-full border-2 transition-all",
                maxPoints === points
                  ? "border-primary-500 bg-primary-500 text-white"
                  : "border-zinc-700 hover:border-primary-300"
              )}
            >
              {points}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {showWarning && (
          <p className="animate-pulse text-center text-sm font-medium text-amber-500">
            {t("matchSetup.equalPlayers")}
          </p>
        )}

        <Button
          variant="primary"
          isLoading={isStarting}
          loadingText={t("matchSetup.button.loading")}
          disabled={!canStart}
          onClick={() => onStartMatch(team1, team2, maxPoints)}
        >
          {!canStart && (team1.length < 2 || team2.length < 2)
            ? t("matchSetup.button.disabled")
            : t("matchSetup.button.start")}
        </Button>
      </div>
    </div>
  );
}
