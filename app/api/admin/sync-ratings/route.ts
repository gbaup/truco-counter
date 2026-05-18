import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { Session } from "@/types/auth";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/types/auth";
import { applyDecay } from "@/lib/glicko";

export async function POST() {
    try {
        const session = await getSession() as Session | null;

        if (!session?.userId) {
            return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
        }

        // Re-read role from DB so stale/missing JWT claims don't affect access control
        const caller = await prisma.users.findUnique({
            where: { id: session.userId },
            select: { role: true },
        });

        if (caller?.role !== UserRole.admin) {
            return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
        }

        const latestMatch = await prisma.matches.findFirst({
            where: { status: "finished" },
            orderBy: { created_at: "desc" },
            select: { created_at: true },
        });

        if (!latestMatch?.created_at) {
            return NextResponse.json({ success: true, updated: 0 });
        }

        const allUsers = await prisma.users.findMany({
            select: { id: true, rating_deviation: true, last_decay_at: true },
        });

        await Promise.all(
            allUsers.map(async (u) => {
                if (u.last_decay_at === null) return;
                const missedMatches = await prisma.matches.count({
                    where: { status: "finished", created_at: { gt: u.last_decay_at } },
                });
                if (missedMatches === 0) return;
                const newRD = Math.round(applyDecay(u.rating_deviation, missedMatches) * 100) / 100;
                await prisma.users.update({
                    where: { id: u.id },
                    data: { rating_deviation: newRD, last_decay_at: latestMatch.created_at },
                });
            }),
        );

        return NextResponse.json({ success: true, updated: allUsers.length });
    } catch (err) {
        console.error("sync-ratings error:", err);
        return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
    }
}
