"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import SideDrawer from "@/components/SideDrawer";
import { UserStats } from "@/types/database";
import { getUserStats } from "@/services/userService";

export default function StatisticsPage() {
  const { t } = useTranslation();
  const [userStats, setUserStats] = useState<UserStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const stats = await getUserStats();
      setUserStats(stats);
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) return (
    <div className="flex h-64 items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
    </div>
  );
  const byGlicko = [...userStats].sort((a, b) => b.rating - a.rating);
  const byElo = [...userStats].sort((a, b) => b.elo_rating - a.elo_rating);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 p-4 transition-colors">
      <SideDrawer />
      <header className="mb-12 text-center">
        <h1 className="text-3xl font-black tracking-tighter text-white md:text-7xl">
          TRUCO<span className="text-primary-600">PRO</span>
        </h1>
      </header>
      <main className="w-full max-w-2xl space-y-6 text-center">

        {/* Glicko ranking */}
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8 shadow-xl">
          <h2 className="mb-1 text-2xl font-bold text-white">Glicko</h2>
          <p className="mb-6 text-xs text-zinc-500">{t("statistics.glickoDescription")}</p>
          <div className="overflow-hidden rounded-xl border border-zinc-800">
            <table className="w-full text-left text-sm text-zinc-400">
              <thead className="bg-zinc-800 text-xs uppercase text-zinc-400">
                <tr>
                  <th scope="col" className="px-4 py-3">#</th>
                  <th scope="col" className="px-4 py-3">{t("statistics.table.player")}</th>
                  <th scope="col" className="px-4 py-3 text-center">W</th>
                  <th scope="col" className="px-4 py-3 text-center">L</th>
                  <th scope="col" className="px-4 py-3 text-right">Rating</th>
                </tr>
              </thead>
              <tbody>
                {byGlicko.map((s, i) => (
                  <tr key={s.user_id} className="border-b border-zinc-800 bg-zinc-900 last:border-b-0">
                    <td className="px-4 py-3 text-zinc-500">{i + 1}</td>
                    <td className="whitespace-nowrap capitalize px-4 py-3 font-medium text-white">{s.username}</td>
                    <td className="px-4 py-3 text-center font-bold text-secondary-500">{s.wins}</td>
                    <td className="px-4 py-3 text-center font-bold text-red-500">{s.losses}</td>
                    <td className="px-4 py-3 text-right font-bold text-white">{Math.round(s.rating)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Elo ranking */}
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8 shadow-xl">
          <h2 className="mb-1 text-2xl font-bold text-white">Elo</h2>
          <p className="mb-6 text-xs text-zinc-500">{t("statistics.eloDescription")}</p>
          <div className="overflow-hidden rounded-xl border border-zinc-800">
            <table className="w-full text-left text-sm text-zinc-400">
              <thead className="bg-zinc-800 text-xs uppercase text-zinc-400">
                <tr>
                  <th scope="col" className="px-4 py-3">#</th>
                  <th scope="col" className="px-4 py-3">{t("statistics.table.player")}</th>
                  <th scope="col" className="px-4 py-3 text-center">W</th>
                  <th scope="col" className="px-4 py-3 text-center">L</th>
                  <th scope="col" className="px-4 py-3 text-right">Rating</th>
                </tr>
              </thead>
              <tbody>
                {byElo.map((s, i) => (
                  <tr key={s.user_id} className="border-b border-zinc-800 bg-zinc-900 last:border-b-0">
                    <td className="px-4 py-3 text-zinc-500">{i + 1}</td>
                    <td className="whitespace-nowrap capitalize px-4 py-3 font-medium text-white">{s.username}</td>
                    <td className="px-4 py-3 text-center font-bold text-secondary-500">{s.wins}</td>
                    <td className="px-4 py-3 text-center font-bold text-red-500">{s.losses}</td>
                    <td className="px-4 py-3 text-right font-bold text-white">{Math.round(s.elo_rating)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}
