import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { applyDecay } from "@/lib/glicko";
import { withAdminAuth } from "@/lib/withAuth";

export const POST = withAdminAuth(async () => {
    try {
        let updatedCount = 0;

        const groups = await prisma.groups.findMany({ select: { id: true } });

        for (const group of groups) {
            const latestGroupMatch = await prisma.matches.findFirst({
                where: { status: "finished", group_id: group.id, created_at: { not: null } },
                orderBy: { created_at: "desc" },
                select: { created_at: true },
            });

            if (!latestGroupMatch?.created_at) continue;

            const [memberships, groupMatchDates] = await Promise.all([
                prisma.group_memberships.findMany({
                    where: { group_id: group.id },
                    select: { user_id: true, rating_deviation: true, last_decay_at: true },
                }),
                prisma.matches.findMany({
                    where: { status: "finished", group_id: group.id, created_at: { not: null, lte: latestGroupMatch.created_at } },
                    select: { created_at: true },
                }),
            ]);

            await Promise.all(
                memberships.map(async (m) => {
                    if (m.last_decay_at === null) return;
                    const missedMatches = groupMatchDates.filter((match) => match.created_at! > m.last_decay_at!).length;
                    if (missedMatches === 0) return;
                    const newRD = Math.round(applyDecay(m.rating_deviation, missedMatches) * 100) / 100;
                    await prisma.group_memberships.update({
                        where: { group_id_user_id: { group_id: group.id, user_id: m.user_id } },
                        data: { rating_deviation: newRD, last_decay_at: latestGroupMatch.created_at },
                    });
                    updatedCount++;
                }),
            );
        }

        return NextResponse.json({ success: true, updated: updatedCount });
    } catch (err) {
        console.error("sync-ratings error:", err);
        return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
    }
});
