"use client";

import { useEffect, useState } from "react";
import { User } from "@/types/database";
import { getUsers } from "@/services/userService";

interface MatchSetupProps {
  onStartMatch: (team1: User[], team2: User[], maxPoints: number) => void;
}

export default function MatchSetup({ onStartMatch }: MatchSetupProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [team1, setTeam1] = useState<User[]>([]);
  const [team2, setTeam2] = useState<User[]>([]);
  const [maxPoints, setMaxPoints] = useState<number>(30);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      const data = await getUsers();
      setUsers(data);
      setLoading(false);
    }
    fetchUsers();
  }, []);

  const toggleUserInTeam = (user: User, team: 1 | 2) => {
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

  const canStart = team1.length >= 2 && team2.length >= 2;

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl space-y-8 rounded-2xl bg-white/10 p-8 shadow-2xl backdrop-blur-md dark:bg-zinc-900/50">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Crear nueva partida
        </h2>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Seleccioná los jugadores y el puntaje
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Team 1 Selection */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-blue-500">Nosotros</h3>
          <div className="max-h-60 overflow-y-auto space-y-2 rounded-xl bg-black/5 p-4 dark:bg-white/5">
            {users.map((user) => (
              <button
                key={user.id}
                onClick={() => toggleUserInTeam(user, 1)}
                className={`capitalize w-full rounded-lg px-4 py-2 text-left transition-all ${
                  team1.find((u) => u.id === user.id)
                    ? "bg-blue-500 text-white"
                    : "hover:bg-black/10 dark:hover:bg-white/10"
                } ${
                  team2.find((u) => u.id === user.id)
                    ? "opacity-30 cursor-not-allowed"
                    : ""
                }`}
                disabled={!!team2.find((u) => u.id === user.id)}
              >
                {user.username}
              </button>
            ))}
          </div>
          <p className="text-sm text-zinc-500">
            {team1.length} / 3 jugadores seleccionados
          </p>
        </div>

        {/* Team 2 Selection */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-green-500">Ellos</h3>
          <div className="max-h-60 overflow-y-auto space-y-2 rounded-xl bg-black/5 p-4 dark:bg-white/5">
            {users.map((user) => (
              <button
                key={user.id}
                onClick={() => toggleUserInTeam(user, 2)}
                className={`capitalize w-full rounded-lg px-4 py-2 text-left transition-all ${
                  team2.find((u) => u.id === user.id)
                    ? "bg-green-500 text-white"
                    : "hover:bg-black/10 dark:hover:bg-white/10"
                } ${
                  team1.find((u) => u.id === user.id)
                    ? "opacity-30 cursor-not-allowed"
                    : ""
                }`}
                disabled={!!team1.find((u) => u.id === user.id)}
              >
                {user.username}
              </button>
            ))}
          </div>
          <p className="text-sm text-zinc-500">
            {team2.length} / 3 jugadores seleccionados
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-center text-xl font-semibold">Puntaje Máximo</h3>
        <div className="flex justify-center gap-4">
          {[20, 30, 40, 50].map((points) => (
            <button
              key={points}
              onClick={() => setMaxPoints(points)}
              className={`h-12 w-12 rounded-full border-2 transition-all ${
                maxPoints === points
                  ? "border-blue-500 bg-blue-500 text-white"
                  : "border-zinc-300 hover:border-blue-300 dark:border-zinc-700"
              }`}
            >
              {points}
            </button>
          ))}
        </div>
      </div>

      <button
        disabled={!canStart}
        onClick={() => onStartMatch(team1, team2, maxPoints)}
        className="group relative w-full overflow-hidden rounded-xl bg-blue-600 px-8 py-4 text-lg font-bold text-white transition-all hover:bg-blue-700 disabled:bg-zinc-500 disabled:opacity-50"
      >
        <div className="relative z-10">Empezar Partido</div>
        <div className="absolute inset-0 z-0 origin-left scale-x-0 bg-blue-400 transition-transform duration-300 group-hover:scale-x-100"></div>
      </button>
    </div>
  );
}
