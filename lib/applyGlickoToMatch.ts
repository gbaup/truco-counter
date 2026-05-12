import type { Prisma } from "@/lib/generated/prisma/client";
import { applyDecay, teamAggregate, updateRating } from "@/lib/glicko";

export async function applyGlickoToMatch(
  tx: Prisma.TransactionClient,
  team1UserIds: string[],
  team2UserIds: string[],
  winnerTeam: 1 | 2,
  matchCreatedAt: Date,
): Promise<void> {
  const allIds = [...team1UserIds, ...team2UserIds];

  const participants = await tx.users.findMany({
    where: { id: { in: allIds } },
    select: { id: true, rating: true, rating_deviation: true, last_match_at: true },
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

  await Promise.all(
    allIds.map((id) => {
      const current = decayed.get(id);
      if (!current) return Promise.resolve();
      const isTeam1 = team1UserIds.includes(id);
      const opponent = isTeam1 ? agg2 : agg1;
      const S: 0 | 1 = (isTeam1 ? 1 : 2) === winnerTeam ? 1 : 0;
      const updated = updateRating(current, opponent, S);
      return tx.users.update({
        where: { id },
        data: {
          rating: Math.round(updated.r * 100) / 100,
          rating_deviation: Math.round(updated.RD * 100) / 100,
          last_match_at: matchCreatedAt,
        },
      });
    }),
  );
}
