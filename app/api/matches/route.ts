import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

import { Session } from "@/types/auth";
import { CreateMatchDto } from "@/types/match";

export async function POST(request: Request) {
    try {
        const session = await getSession() as Session | null;

        if (!session || !session.userId) {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 401 }
            );
        }

        const body: CreateMatchDto = await request.json();
        const { score1, score2, team1, team2, winner_team, status } = body;

        if (!team1 || team1.length === 0 || !team2 || team2.length === 0) {
            return NextResponse.json(
                { success: false, error: "Both teams must have at least one player" },
                { status: 400 }
            );
        }

        const allPlayerIds = [...team1, ...team2].map(user => user.id);


        const existingMatch = await prisma.matches.findFirst({
            where: {
                status: "ongoing",
                match_participants: {
                    some: {
                        user_id: {
                            in: allPlayerIds
                        }
                    }
                }
            },
            include: {
                match_participants: true
            }
        });

        if (existingMatch) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Uno o más jugadores ya están en una partida activa.",
                    code: "PLAYERS_BUSY"
                },
                { status: 409 }
            );
        }

        const matchStatus = status || "ongoing";

        if (matchStatus === "finished") {
            if (
                score1 === undefined ||
                score2 === undefined ||
                winner_team === undefined
            ) {
                return NextResponse.json(
                    { error: "Missing required match data for finished match (score1, score2, winner_team)" },
                    { status: 400 }
                );
            }
        }

        const match = await prisma.matches.create({
            data: {
                score_team_1: score1 ?? 0,
                score_team_2: score2 ?? 0,
                winner_team: winner_team,
                status: matchStatus,
                created_by: session.userId,

                match_participants: {
                    create: [
                        ...team1.map((user) => ({
                            user_id: user.id,
                            team: 1,
                        })),
                        ...team2.map((user) => ({
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