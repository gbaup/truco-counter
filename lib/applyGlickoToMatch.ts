import type { Prisma } from "@/lib/generated/prisma/client";
import { applyDecay, teamAggregate, updateRating } from "@/lib/glicko";
import { teamAvgElo, updateElo } from "@/lib/elo";

export async function applyGlickoToMatch(
  tx: Prisma.TransactionClient,
  team1UserIds: string[],
  team2UserIds: string[],
  winnerTeam: 1 | 2,
  matchCreatedAt: Date,
  matchId: string,
): Promise<void> {
  const allIds = [...team1UserIds, ...team2UserIds];

  const participants = await tx.users.findMany({
    where: { id: { in: allIds } },
    select: { id: true, rating: true, rating_deviation: true, elo_rating: true, last_match_at: true },
  });

  const byId = new Map(participants.map((p) => [p.id, p]));

  const decayed = new Map<string, { r: number; RD: number }>();

  for (const id of allIds) {
    const p = byId.get(id);
    if (!p) continue;
    let missedMatches = 0;
    if (p.last_match_at !== null) {
      missedMatches = await tx.matches.count({
        where: {
          status: "finished",
          created_at: { gt: p.last_match_at, lt: matchCreatedAt },
        },
      });
    }
    decayed.set(id, {
      r: p.rating,
      RD: applyDecay(p.rating_deviation, missedMatches),
    });
  }

  const team1 = team1UserIds.map((id) => decayed.get(id)!).filter(Boolean);
  const team2 = team2UserIds.map((id) => decayed.get(id)!).filter(Boolean);
  const agg1 = teamAggregate(team1);
  const agg2 = teamAggregate(team2);

  const eloAvg1 = teamAvgElo(team1UserIds.map((id) => byId.get(id)!.elo_rating));
  const eloAvg2 = teamAvgElo(team2UserIds.map((id) => byId.get(id)!.elo_rating));

  await Promise.all(
    allIds.map((id) => {
      const current = decayed.get(id);
      const p = byId.get(id);
      if (!current || !p) return Promise.resolve();
      const isTeam1 = team1UserIds.includes(id);
      const opponent = isTeam1 ? agg2 : agg1;
      const S: 0 | 1 = (isTeam1 ? 1 : 2) === winnerTeam ? 1 : 0;
      const updated = updateRating(current, opponent, S);
      const ratingChange = Math.round((updated.r - current.r) * 100) / 100;
      const newElo = Math.round(updateElo(p.elo_rating, isTeam1 ? eloAvg2 : eloAvg1, S) * 100) / 100;
      const eloChange = Math.round((newElo - p.elo_rating) * 100) / 100;
      return Promise.all([
        tx.users.update({
          where: { id },
          data: {
            rating: Math.round(updated.r * 100) / 100,
            rating_deviation: Math.round(updated.RD * 100) / 100,
            elo_rating: newElo,
            last_match_at: matchCreatedAt,
          },
        }),
        tx.match_participants.update({
          where: { match_id_user_id: { match_id: matchId, user_id: id } },
          data: { rating_change: ratingChange, elo_rating_change: eloChange },
        }),
      ]);
    }),
  );
}
