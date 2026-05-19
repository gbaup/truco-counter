import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { applyDecay, missedMatchesWhere } from "@/lib/glicko";
import { withAdminAuth } from "@/lib/withAuth";

export const POST = withAdminAuth(async () => {
    try {
        const latestMatch = await prisma.matches.findFirst({
            where: { status: "finished", created_at: { not: null } },
            orderBy: { created_at: "desc" },
            select: { created_at: true },
        });

        if (!latestMatch?.created_at) {
            return NextResponse.json({ success: true, updated: 0 });
        }

        const allUsers = await prisma.users.findMany({
            select: { id: true, rating_deviation: true, last_decay_at: true },
        });

        let updatedCount = 0;

        await Promise.all(
            allUsers.map(async (u) => {
                if (u.last_decay_at === null) return;
                const missedMatches = await prisma.matches.count({
                    where: missedMatchesWhere(u.last_decay_at),
                });
                if (missedMatches === 0) return;
                const newRD = Math.round(applyDecay(u.rating_deviation, missedMatches) * 100) / 100;
                await prisma.users.update({
                    where: { id: u.id },
                    data: { rating_deviation: newRD, last_decay_at: latestMatch.created_at },
                });
                updatedCount++;
            }),
        );

        return NextResponse.json({ success: true, updated: updatedCount });
    } catch (err) {
        console.error("sync-ratings error:", err);
        return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
    }
});
