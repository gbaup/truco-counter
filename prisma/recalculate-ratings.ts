import { config } from "dotenv";
config({ path: ".env.local" });
import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { applyDecay, teamAggregate, updateRating, GLICKO } from "../lib/glicko";
import { teamAvgElo, updateElo, ELO_DEFAULT } from "../lib/elo";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

interface PlayerState {
  r: number;
  RD: number;
  elo: number;
  lastMatchIndex: number; // index into the group's matches array (-1 = never played)
}

async function main() {
  // Null out rating changes for global (ungrouped) matches — no group context to compute them from
  const cleared = await prisma.match_participants.updateMany({
    where: { matches: { group_id: null } },
    data: { rating_change: null, elo_rating_change: null },
  });
  console.log(`Cleared rating changes for ${cleared.count} participants in global matches.`);

  const groups = await prisma.groups.findMany({ select: { id: true, name: true } });
  console.log(`Processing ${groups.length} groups...`);

  let totalParticipantUpdates = 0;

  for (const group of groups) {
    console.log(`\nGroup: ${group.name} (${group.id})`);

    const memberships = await prisma.group_memberships.findMany({
      where: { group_id: group.id },
      select: { user_id: true },
    });

    const userIds = memberships.map((m) => m.user_id);
    if (userIds.length === 0) {
      console.log("  No members, skipping.");
      continue;
    }

    // Reset all memberships to defaults before replaying
    await prisma.group_memberships.updateMany({
      where: { group_id: group.id },
      data: {
        rating: GLICKO.r0,
        rating_deviation: GLICKO.RD0,
        elo_rating: ELO_DEFAULT,
        last_decay_at: null,
      },
    });

    const state = new Map<string, PlayerState>(
      userIds.map((id) => [id, { r: GLICKO.r0, RD: GLICKO.RD0, elo: ELO_DEFAULT, lastMatchIndex: -1 }]),
    );

    const matches = await prisma.matches.findMany({
      where: { status: "finished", winner_team: { not: null }, group_id: group.id },
      include: {
        match_participants: { select: { user_id: true, team: true } },
      },
      orderBy: { created_at: "asc" },
    });

    console.log(`  Processing ${matches.length} finished matches...`);

    const ratingChanges: { matchId: string; userId: string; change: number; eloChange: number }[] = [];

    for (let i = 0; i < matches.length; i++) {
      const match = matches[i];
      if (!match.winner_team) continue;

      const team1Ids = match.match_participants
        .filter((p) => p.team === 1 && p.user_id && state.has(p.user_id))
        .map((p) => p.user_id!);
      const team2Ids = match.match_participants
        .filter((p) => p.team === 2 && p.user_id && state.has(p.user_id))
        .map((p) => p.user_id!);

      if (team1Ids.length === 0 || team2Ids.length === 0) continue;

      const allIds = [...team1Ids, ...team2Ids];

      const decayed = new Map<string, { r: number; RD: number }>();
      for (const id of allIds) {
        const p = state.get(id)!;
        const missedMatches = p.lastMatchIndex === -1 ? 0 : i - p.lastMatchIndex - 1;
        decayed.set(id, { r: p.r, RD: applyDecay(p.RD, missedMatches) });
      }

      const team1 = team1Ids.map((id) => decayed.get(id)!);
      const team2 = team2Ids.map((id) => decayed.get(id)!);
      const agg1 = teamAggregate(team1);
      const agg2 = teamAggregate(team2);

      const eloAvg1 = teamAvgElo(team1Ids.map((id) => state.get(id)!.elo));
      const eloAvg2 = teamAvgElo(team2Ids.map((id) => state.get(id)!.elo));

      for (const id of allIds) {
        const current = decayed.get(id)!;
        const isTeam1 = team1Ids.includes(id);
        const opponent = isTeam1 ? agg2 : agg1;
        const S: 0 | 1 = (isTeam1 ? 1 : 2) === match.winner_team ? 1 : 0;
        const updated = updateRating(current, opponent, S);
        const s = state.get(id)!;
        s.r = updated.r;
        s.RD = updated.RD;
        const newElo = updateElo(s.elo, isTeam1 ? eloAvg2 : eloAvg1, S);
        const eloChange = Math.round((newElo - s.elo) * 100) / 100;
        s.elo = newElo;
        s.lastMatchIndex = i;
        ratingChanges.push({
          matchId: match.id,
          userId: id,
          change: Math.round((updated.r - current.r) * 100) / 100,
          eloChange,
        });
      }
    }

    await Promise.all(
      [...state.entries()].map(([userId, s]) =>
        prisma.group_memberships.update({
          where: { group_id_user_id: { group_id: group.id, user_id: userId } },
          data: {
            rating: Math.round(s.r * 100) / 100,
            rating_deviation: Math.round(s.RD * 100) / 100,
            elo_rating: Math.round(s.elo * 100) / 100,
            last_decay_at: s.lastMatchIndex >= 0 ? matches[s.lastMatchIndex].created_at : null,
          },
        }),
      ),
    );

    await Promise.all(
      ratingChanges.map(({ matchId, userId, change, eloChange }) =>
        prisma.match_participants.update({
          where: { match_id_user_id: { match_id: matchId, user_id: userId } },
          data: { rating_change: change, elo_rating_change: eloChange },
        }),
      ),
    );

    totalParticipantUpdates += ratingChanges.length;
    console.log(`  Done. Updated ${userIds.length} memberships, ${ratingChanges.length} participant deltas.`);
  }

  console.log(`\nDone. Processed ${groups.length} groups, ${totalParticipantUpdates} total participant updates.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
