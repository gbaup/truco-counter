import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { Session } from "@/types/auth";
import { prisma } from "@/lib/prisma";
import { applyDecay } from "@/lib/glicko";

export async function POST() {
    try {
        const session = await getSession() as Session | null;

        if (!session?.userId || session.role !== "admin") {
            return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
        }

        const allUsers = await prisma.users.findMany({
            select: { id: true, rating_deviation: true, last_match_at: true },
        });

        await Promise.all(
            allUsers.map(async (u) => {
                if (u.last_match_at === null) return;
                const missedMatches = await prisma.matches.count({
                    where: { status: "finished", created_at: { gt: u.last_match_at } },
                });
                if (missedMatches === 0) return;
                const newRD = Math.round(applyDecay(u.rating_deviation, missedMatches) * 100) / 100;
                await prisma.users.update({
                    where: { id: u.id },
                    data: { rating_deviation: newRD },
                });
            }),
        );

        return NextResponse.json({ success: true, updated: allUsers.length });
    } catch (err) {
        console.error("sync-ratings error:", err);
        return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
    }
}
