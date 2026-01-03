import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { score1, score2, winner_team, team1, team2 } = body;

        if (
            score1 === undefined ||
            score2 === undefined ||
            !winner_team ||
            !team1 ||
            !team2
        ) {
            return NextResponse.json(
                { error: "Missing required match data" },
                { status: 400 }
            );
        }

        const match = await prisma.matches.create({
            data: {
                score_team_1: score1,
                score_team_2: score2,
                winner_team: winner_team,
                status: "finished",

                match_participants: {
                    create: [
                        ...team1.map((user: { id: string }) => ({
                            user_id: user.id,
                            team: 1,
                        })),
                        ...team2.map((user: { id: string }) => ({
                            user_id: user.id,
                            team: 2,
                        })),
                    ],
                },
            },
        });

        return NextResponse.json(match);
    } catch (error) {
        console.error("Error saving match API:", error);
        return NextResponse.json(
            { error: "Failed to save match" },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const matches = await prisma.matches.findMany({
            where: {
                status: "finished",
            },
            include: {
                match_participants: {
                    select: {
                        user_id: true,
                        team: true,
                    },
                },
            },
            orderBy: {
                created_at: 'desc'
            }
        });

        return NextResponse.json(matches);
    } catch (error) {
        console.error("Error fetching matches:", error);
        return NextResponse.json(
            { error: "Failed to fetch matches" },
            { status: 500 }
        );
    }
}