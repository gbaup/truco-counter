"use client";

import { useState, useEffect } from "react";
import SideDrawer from "@/components/SideDrawer";
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
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 p-4 transition-colors">
      <SideDrawer />
      <header className="mb-12 text-center">
        <h1 className="text-3xl font-black tracking-tighter text-white md:text-7xl">
          TRUCO<span className="text-primary-600">PRO</span>
        </h1>
      </header>
      <main className="w-full max-w-lg text-center">
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8 shadow-xl">
          <h2 className="mb-6 text-2xl font-bold text-white">
            Statistics
          </h2>

          <div className="overflow-hidden rounded-xl border border-zinc-800">
            <table className="w-full text-left text-sm text-zinc-400">
              <thead className="bg-zinc-800 text-xs uppercase text-zinc-400">
                <tr>
                  <th scope="col" className="px-6 py-3">Player</th>
                  <th scope="col" className="px-6 py-3 text-center">W</th>
                  <th scope="col" className="px-6 py-3 text-center">L</th>
                </tr>
              </thead>
              <tbody>
                {userStats.map((userStat) => {
                  return (
                    <tr key={userStat.user_id} className="border-b border-zinc-800 bg-zinc-900 last:border-b-0">
                      <td className="whitespace-nowrap capitalize px-6 py-4 font-medium text-white">
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
