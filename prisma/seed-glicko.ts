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
  lastMatchIndex: number; // index into the matches array (-1 = never played)
}

async function main() {
  // Recreate user_stats view to include rating columns
  await prisma.$executeRaw`
    CREATE OR REPLACE VIEW user_stats AS
    SELECT
      u.id AS user_id,
      u.username,
      COUNT(mp.match_id) FILTER (
        WHERE m.status = 'finished' AND m.winner_team = mp.team
      ) AS wins,
      COUNT(mp.match_id) FILTER (
        WHERE m.status = 'finished'
          AND m.winner_team IS NOT NULL
          AND m.winner_team != mp.team
      ) AS losses,
      u.rating,
      u.rating_deviation,
      u.elo_rating
    FROM users u
    LEFT JOIN match_participants mp ON mp.user_id = u.id
    LEFT JOIN matches m ON m.id = mp.match_id
    GROUP BY u.id, u.username, u.rating, u.rating_deviation, u.elo_rating
  `;
  console.log("Recreated user_stats view");

  const users = await prisma.users.findMany({ select: { id: true } });

  const state = new Map<string, PlayerState>(
    users.map((u) => [u.id, { r: GLICKO.r0, RD: GLICKO.RD0, elo: ELO_DEFAULT, lastMatchIndex: -1 }]),
  );

  const matches = await prisma.matches.findMany({
    where: { status: "finished", winner_team: { not: null } },
    include: {
      match_participants: { select: { user_id: true, team: true } },
    },
    orderBy: { created_at: "asc" },
  });

  console.log(`Processing ${matches.length} finished matches...`);

  const ratingChanges: { matchId: string; userId: string; change: number }[] = [];

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

    // Apply inactivity decay per player (Glicko)
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
      s.elo = updateElo(s.elo, isTeam1 ? eloAvg2 : eloAvg1, S);
      s.lastMatchIndex = i;
      ratingChanges.push({
        matchId: match.id,
        userId: id,
        change: Math.round((updated.r - current.r) * 100) / 100,
      });
    }
  }

  console.log("Writing user ratings...");
  await Promise.all(
    [...state.entries()].map(([id, s]) =>
      prisma.users.update({
        where: { id },
        data: {
          rating: Math.round(s.r * 100) / 100,
          rating_deviation: Math.round(s.RD * 100) / 100,
          elo_rating: Math.round(s.elo * 100) / 100,
          last_match_at:
            s.lastMatchIndex >= 0
              ? matches[s.lastMatchIndex].created_at
              : null,
        },
      })
    ),
  );

  console.log("Writing participant rating changes...");
  await Promise.all(
    ratingChanges.map(({ matchId, userId, change }) =>
      prisma.match_participants.update({
        where: { match_id_user_id: { match_id: matchId, user_id: userId } },
        data: { rating_change: change },
      })
    ),
  );

  console.log(`Done. Seeded ratings for ${state.size} players and ${ratingChanges.length} participant deltas.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
