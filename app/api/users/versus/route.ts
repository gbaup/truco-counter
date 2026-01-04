import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type VersusStats = {
    total_matches: number;
    p1_wins: number;
    p2_wins: number;
    draws: number;
};

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const p1 = searchParams.get("p1");
    const p2 = searchParams.get("p2");

    if (!p1 || !p2) {
        return NextResponse.json({ error: "Missing user IDs" }, { status: 400 });
    }

    try {
        const result = await prisma.$queryRaw<VersusStats[]>`
            SELECT * FROM get_users_versus(${p1}::uuid, ${p2}::uuid)
        `;

        const stats = result[0] || {
            total_matches: 0,
            p1_wins: 0,
            p2_wins: 0,
            draws: 0
        };

        const serializedStats = JSON.parse(JSON.stringify(stats, (key, value) =>
            typeof value === 'bigint'
                ? Number(value)
                : value
        ));

        return NextResponse.json(serializedStats);

    } catch (error) {
        console.error("Error in versus API:", error);
        return NextResponse.json({
            error: error instanceof Error ? error.message : "An unknown error occurred"
        }, { status: 500 });
    }
}