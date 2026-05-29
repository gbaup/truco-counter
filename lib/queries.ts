import { prisma } from "@/lib/prisma";
import { UserStats, VersusStats } from "@/types/database";

export type Scope = { type: "global" } | { type: "group"; groupId: string };

function deserializeBigints<T>(data: T): T {
    return JSON.parse(
        JSON.stringify(data, (_, v) => (typeof v === "bigint" ? Number(v) : v))
    );
}

export async function getUserStats(scope: Scope = { type: "global" }): Promise<UserStats[]> {
    if (scope.type === "global") {
        const data = await prisma.$queryRaw<UserStats[]>`
            SELECT user_id, username, wins, losses, rating, rating_deviation, elo_rating
            FROM user_stats
        `;
        return deserializeBigints(data);
    }

    const { groupId } = scope;
    const data = await prisma.$queryRaw<UserStats[]>`
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
            gm.rating,
            gm.rating_deviation,
            gm.elo_rating
        FROM users u
        JOIN group_memberships gm ON gm.user_id = u.id AND gm.group_id = ${groupId}::uuid
        LEFT JOIN match_participants mp ON mp.user_id = u.id
        LEFT JOIN matches m ON m.id = mp.match_id AND m.group_id = ${groupId}::uuid
        GROUP BY u.id, u.username, gm.rating, gm.rating_deviation, gm.elo_rating
    `;
    return deserializeBigints(data);
}

export async function getUsersVersus(
    p1: string,
    p2: string,
    scope: Scope = { type: "global" },
): Promise<VersusStats> {
    if (scope.type === "global") {
        const result = await prisma.$queryRaw<VersusStats[]>`
            SELECT * FROM get_users_versus(${p1}::uuid, ${p2}::uuid)
        `;
        const stats: VersusStats = result[0] ?? {
            total_matches: 0,
            p1_wins: 0,
            p2_wins: 0,
            draws: 0,
        };
        return deserializeBigints(stats);
    }

    const { groupId } = scope;
    const result = await prisma.$queryRaw<VersusStats[]>`
        SELECT
            COUNT(*) FILTER (WHERE m.status = 'finished' AND m.winner_team IS NOT NULL) AS total_matches,
            COUNT(*) FILTER (WHERE m.status = 'finished' AND mp1.team = m.winner_team) AS p1_wins,
            COUNT(*) FILTER (WHERE m.status = 'finished' AND mp2.team = m.winner_team) AS p2_wins,
            0 AS draws
        FROM matches m
        JOIN match_participants mp1 ON mp1.match_id = m.id AND mp1.user_id = ${p1}::uuid
        JOIN match_participants mp2 ON mp2.match_id = m.id AND mp2.user_id = ${p2}::uuid
        WHERE m.group_id = ${groupId}::uuid
            AND mp1.team != mp2.team
    `;
    const stats = result[0] ?? { total_matches: 0, p1_wins: 0, p2_wins: 0, draws: 0 };
    return deserializeBigints(stats);
}
