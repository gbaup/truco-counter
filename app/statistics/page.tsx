"use client";

import { useState, useEffect } from "react";
import BurgerMenu from "@/components/ui/BurgerMenu";
import { UserStats } from "@/types/database";
import { getUserStats } from "@/services/userService";

export default function StatisticsPage() {
  const [userStats, setUserStats] = useState<UserStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const stats = await getUserStats();
      const sortedStats = stats.sort((a, b) => (b.wins / (b.wins + b.losses)) - (a.wins / (a.wins + a.losses)));
      setUserStats(sortedStats);
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) return (
    <div className="flex h-64 items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
    </div>
  );

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 p-4 transition-colors dark:bg-zinc-950">
      <BurgerMenu />
      <header className="mb-12 text-center">
        <h1 className="text-3xl font-black tracking-tighter text-zinc-900 dark:text-white md:text-7xl">
          TRUCO<span className="text-primary-600">PRO</span>
        </h1>
      </header>
      <main className="w-full max-w-lg text-center">
        <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-white">
            Statistics
          </h2>

          <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
            <table className="w-full text-left text-sm text-zinc-500 dark:text-zinc-400">
              <thead className="bg-zinc-100 text-xs uppercase text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400">
                <tr>
                  <th scope="col" className="px-6 py-3">Player</th>
                  <th scope="col" className="px-6 py-3 text-center">W</th>
                  <th scope="col" className="px-6 py-3 text-center">L</th>
                </tr>
              </thead>
              <tbody>
                {userStats.map((userStat) => {
                  return (
                    <tr key={userStat.user_id} className="border-b bg-white last:border-b-0 dark:border-zinc-800 dark:bg-zinc-900">
                      <td className="whitespace-nowrap capitalize px-6 py-4 font-medium text-zinc-900 dark:text-white">
                        {userStat.username}
                      </td>
                      <td className="px-6 py-4 text-center font-bold text-secondary-600">
                        {userStat.wins}
                      </td>
                      <td className="px-6 py-4 text-center font-bold text-red-500">
                        {userStat.losses}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
