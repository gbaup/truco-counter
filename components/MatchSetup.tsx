"use client";

import { useEffect, useState } from "react";
import { PublicUser } from "@/types/database";
import { getUsers } from "@/services/userService";
import { twMerge } from "tailwind-merge";

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
    <div className="w-full max-w-2xl space-y-8 rounded-2xl bg-white/10 p-8 shadow-2xl backdrop-blur-md dark:bg-zinc-900/50">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-primary-500">Nosotros</h3>
          <div className="max-h-60 overflow-y-auto space-y-2 rounded-xl bg-black/5 p-4 dark:bg-white/5">
            {users.map((user) => (
              <button
                key={user.id}
                onClick={() => toggleUserInTeam(user, 1)}
                className={twMerge(`disabled:opacity-30 disabled:cursor-not-allowed capitalize w-full rounded-lg px-4 py-2 text-left transition-all`, team1.find((u) => u.id === user.id)
                  ? "bg-primary-500 text-white"
                  : "hover:bg-black/10 dark:hover:bg-white/10"
                )}
                disabled={!!team2.find((u) => u.id === user.id) || user.isPlaying}
              >
                {user.username}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-secondary-500">Ellos</h3>
          <div className="max-h-60 overflow-y-auto space-y-2 rounded-xl bg-black/5 p-4 dark:bg-white/5">
            {users.map((user) => (
              <button
                key={user.id}
                onClick={() => toggleUserInTeam(user, 2)}
                className={twMerge(`disabled:opacity-30 disabled:cursor-not-allowed capitalize w-full rounded-lg px-4 py-2 text-left transition-all`, team2.find((u) => u.id === user.id)
                  ? "bg-secondary-500 text-white"
                  : "hover:bg-black/10 dark:hover:bg-white/10"
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
        <h3 className="text-center text-xl font-semibold">Puntaje máximo</h3>
        <div className="flex justify-center gap-4">
          {[20, 30, 40, 50].map((points) => (
            <button
              key={points}
              onClick={() => setMaxPoints(points)}
              className={`h-12 w-12 rounded-full border-2 transition-all ${maxPoints === points
                ? "border-primary-500 bg-primary-500 text-white"
                : "border-zinc-300 hover:border-primary-300 dark:border-zinc-700"
                }`}
            >
              {points}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {showWarning && (
          <p className="animate-pulse text-center text-sm font-medium text-amber-500">
            ⚠ Los equipos deben tener la misma cantidad de jugadores
          </p>
        )}

        <button
          disabled={!canStart || isStarting}
          onClick={() => onStartMatch(team1, team2, maxPoints)}
          className="group relative w-full overflow-hidden rounded-xl bg-primary-600 px-8 py-4 text-lg font-bold text-white transition-all hover:bg-primary-700 disabled:bg-zinc-500 disabled:opacity-50"
        >
          <div className="relative z-10 flex items-center justify-center gap-2">
            {isStarting ? (
              <>
                <svg
                  className="h-5 w-5 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Iniciando...</span>
              </>
            ) : (
              <>
                {!canStart && (team1.length < 2 || team2.length < 2)
                  ? "Mínimo 2 vs 2"
                  : !canStart && team1.length !== team2.length
                    ? "Equipos desiguales"
                    : "Empezar Partido"}
              </>
            )}
          </div>
          <div className="absolute inset-0 z-0 origin-left scale-x-0 bg-primary-400 transition-transform duration-300 group-hover:scale-x-100"></div>
        </button>
      </div>
    </div>
  );
}
