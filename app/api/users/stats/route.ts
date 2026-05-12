import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type UserStat = {
    user_id: string;
    username: string;
    wins: number;
    losses: number;
    rating: number;
    rating_deviation: number;
};

export async function GET() {
    try {
        const data = await prisma.$queryRaw<UserStat[]>`
            SELECT user_id, username, wins, losses, rating, rating_deviation FROM user_stats
        `;

        const serializedData = JSON.parse(
            JSON.stringify(data, (key, value) =>
                typeof value === "bigint" ? Number(value) : value
            )
        );

        return NextResponse.json(serializedData || []);

    } catch (error) {
        console.error("Error in user stats API:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}