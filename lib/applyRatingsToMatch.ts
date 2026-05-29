import type { Prisma } from "@/lib/generated/prisma/client";
import { applyDecay, teamAggregate, updateRating, missedMatchesWhere } from "@/lib/glicko";
import { teamAvgElo, updateElo } from "@/lib/elo";

export function extractTeamIds(
  participants: { team: number | null; user_id: string | null }[]
) {
  return {
    team1Ids: participants.filter((p) => p.team === 1 && p.user_id).map((p) => p.user_id!),
    team2Ids: participants.filter((p) => p.team === 2 && p.user_id).map((p) => p.user_id!),
  };
}

export async function applyRatingsToMatch(
  tx: Prisma.TransactionClient,
  team1UserIds: string[],
  team2UserIds: string[],
  winnerTeam: 1 | 2,
  matchCreatedAt: Date,
  matchId: string,
  groupId?: string | null,
): Promise<void> {
  if (groupId) {
    return applyGroupRatings(tx, team1UserIds, team2UserIds, winnerTeam, matchCreatedAt, matchId, groupId);
  }
  return applyGlobalRatings(tx, team1UserIds, team2UserIds, winnerTeam, matchCreatedAt, matchId);
}

type RatingData = { rating: number; rating_deviation: number; elo_rating: number; last_decay_at: Date };

async function applyRatingCalculations(
  tx: Prisma.TransactionClient,
  team1UserIds: string[],
  team2UserIds: string[],
  winnerTeam: 1 | 2,
  matchId: string,
  matchCreatedAt: Date,
  decayed: Map<string, { r: number; RD: number }>,
  eloById: Map<string, number>,
  writeRatings: (id: string, data: RatingData) => Promise<unknown>,
): Promise<void> {
  const allIds = [...team1UserIds, ...team2UserIds];
  const resolvedTeam1Ids = team1UserIds.filter((id) => decayed.has(id));
  const resolvedTeam2Ids = team2UserIds.filter((id) => decayed.has(id));
  const team1 = resolvedTeam1Ids.map((id) => decayed.get(id)!);
  const team2 = resolvedTeam2Ids.map((id) => decayed.get(id)!);

  if (team1.length === 0 || team2.length === 0) return;

  const agg1 = teamAggregate(team1);
  const agg2 = teamAggregate(team2);
  const eloAvg1 = teamAvgElo(resolvedTeam1Ids.map((id) => eloById.get(id)!));
  const eloAvg2 = teamAvgElo(resolvedTeam2Ids.map((id) => eloById.get(id)!));

  await Promise.all(
    allIds.map((id) => {
      const current = decayed.get(id);
      const elo = eloById.get(id);
      if (!current || elo === undefined) return Promise.resolve();
      const isTeam1 = team1UserIds.includes(id);
      const opponent = isTeam1 ? agg2 : agg1;
      const S: 0 | 1 = (isTeam1 ? 1 : 2) === winnerTeam ? 1 : 0;
      const updated = updateRating(current, opponent, S);
      const ratingChange = Math.round((updated.r - current.r) * 100) / 100;
      const newElo = Math.round(updateElo(elo, isTeam1 ? eloAvg2 : eloAvg1, S) * 100) / 100;
      const eloChange = Math.round((newElo - elo) * 100) / 100;
      return Promise.all([
        writeRatings(id, {
          rating: Math.round(updated.r * 100) / 100,
          rating_deviation: Math.round(updated.RD * 100) / 100,
          elo_rating: newElo,
          last_decay_at: matchCreatedAt,
        }),
        tx.match_participants.update({
          where: { match_id_user_id: { match_id: matchId, user_id: id } },
          data: { rating_change: ratingChange, elo_rating_change: eloChange },
        }),
      ]);
    }),
  );
}

async function applyGlobalRatings(
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
    select: { id: true, rating: true, rating_deviation: true, elo_rating: true, last_decay_at: true },
  });

  const byId = new Map(participants.map((p) => [p.id, p]));
  const decayed = new Map<string, { r: number; RD: number }>();

  for (const id of allIds) {
    const p = byId.get(id);
    if (!p) continue;
    let missedMatches = 0;
    if (p.last_decay_at !== null) {
      missedMatches = await tx.matches.count({
        where: missedMatchesWhere(p.last_decay_at, matchCreatedAt),
      });
    }
    decayed.set(id, { r: p.rating, RD: applyDecay(p.rating_deviation, missedMatches) });
  }

  await applyRatingCalculations(
    tx, team1UserIds, team2UserIds, winnerTeam, matchId, matchCreatedAt,
    decayed,
    new Map(participants.map((p) => [p.id, p.elo_rating])),
    (id, data) => tx.users.update({ where: { id }, data }),
  );
}

async function applyGroupRatings(
  tx: Prisma.TransactionClient,
  team1UserIds: string[],
  team2UserIds: string[],
  winnerTeam: 1 | 2,
  matchCreatedAt: Date,
  matchId: string,
  groupId: string,
): Promise<void> {
  const allIds = [...team1UserIds, ...team2UserIds];

  const memberships = await tx.group_memberships.findMany({
    where: { group_id: groupId, user_id: { in: allIds } },
    select: { user_id: true, rating: true, rating_deviation: true, elo_rating: true, last_decay_at: true },
  });

  const byId = new Map(memberships.map((m) => [m.user_id, m]));
  const decayed = new Map<string, { r: number; RD: number }>();

  for (const id of allIds) {
    const m = byId.get(id);
    if (!m) continue;
    let missedMatches = 0;
    if (m.last_decay_at !== null) {
      missedMatches = await tx.matches.count({
        where: missedMatchesWhere(m.last_decay_at, matchCreatedAt, groupId),
      });
    }
    decayed.set(id, { r: m.rating, RD: applyDecay(m.rating_deviation, missedMatches) });
  }

  await applyRatingCalculations(
    tx, team1UserIds, team2UserIds, winnerTeam, matchId, matchCreatedAt,
    decayed,
    new Map(memberships.map((m) => [m.user_id, m.elo_rating])),
    (id, data) => tx.group_memberships.update({
      where: { group_id_user_id: { group_id: groupId, user_id: id } },
      data,
    }),
  );
}
