import BurgerMenu from "@/components/BurgerMenu";
import { getMatches } from "@/services/matchService";
import { getUsers } from "@/services/userService";
import { PublicUser } from "@/types/database";

export default async function StatisticsPage() {
  const [users, matches] = await Promise.all([getUsers(), getMatches()]);

  const userStats = users.map((user) => {
    let wins = 0;
    let losses = 0;

    matches.forEach((match: any) => {
      const isTeam1 = match.match_participants.some(
        (p: any) => p.user_id === user.id && p.team === 1,
      );
      const isTeam2 = match.match_participants.some(
        (p: any) => p.user_id === user.id && p.team === 2,
      );

      if (isTeam1) {
        if (match.winner_team === 1) wins++;
        else losses++;
      } else if (isTeam2) {
        if (match.winner_team === 2) wins++;
        else losses++;
      }
    });

    return { ...user, wins, losses };
  });

  // Sort by wins (descending)
  userStats.sort((a, b) => b.wins - a.wins);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 p-4 transition-colors dark:bg-zinc-950">
      <BurgerMenu />
      <header className="mb-12 text-center">
        <h1 className="text-3xl font-black tracking-tighter text-zinc-900 dark:text-white md:text-7xl">
          TRUCO<span className="text-blue-600">PRO</span>
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
                {userStats.map((user) => (
                  <tr key={user.id} className="border-b bg-white last:border-b-0 dark:border-zinc-800 dark:bg-zinc-900">
                    <td className="whitespace-nowrap px-6 py-4 font-medium text-zinc-900 dark:text-white">
                      {user.name}
                    </td>
                    <td className="px-6 py-4 text-center font-bold text-green-600">
                      {user.wins}
                    </td>
                    <td className="px-6 py-4 text-center font-bold text-red-500">
                      {user.losses}
                    </td>
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
