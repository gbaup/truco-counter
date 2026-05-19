import { prisma } from "@/lib/prisma";
import { UserStats, VersusStats } from "@/types/database";

function deserializeBigints<T>(data: T): T {
    return JSON.parse(
        JSON.stringify(data, (_, v) => (typeof v === "bigint" ? Number(v) : v))
    );
}

export async function getUserStats(): Promise<UserStats[]> {
    const data = await prisma.$queryRaw<UserStats[]>`
        SELECT user_id, username, wins, losses, rating, rating_deviation, elo_rating
        FROM user_stats
    `;
    return deserializeBigints(data);
}

export async function getUsersVersus(
    p1: string,
    p2: string
): Promise<VersusStats> {
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
