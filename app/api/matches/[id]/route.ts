import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { applyGlickoToMatch } from "@/lib/applyGlickoToMatch";
import { Session } from "@/types/auth";
import { UpdateMatchDto } from "@/types/match";

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = (await getSession()) as Session | null;

        if (!session || !session.userId) {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Await params before using its properties
        const { id } = await params;

        const body: UpdateMatchDto = await request.json();
        const { score1, score2, winner_team, status } = body;

        const matchValue = await prisma.matches.findUnique({
            where: { id },
            include: { match_participants: true },
        });

        if (!matchValue) {
            return NextResponse.json(
                { success: false, error: "Match not found" },
                { status: 404 }
            );
        }

        if (matchValue.created_by !== session.userId) {
            return NextResponse.json(
                { success: false, error: "Unauthorized to edit this match" },
                { status: 403 }
            );
        }

        const isFinishing =
            status === "finished" && matchValue.status !== "finished";

        const updatedMatch = await (isFinishing && winner_team != null
            ? prisma.$transaction(async (tx) => {
                const updated = await tx.matches.update({
                    where: { id },
                    data: {
                        score_team_1: score1,
                        score_team_2: score2,
                        winner_team: winner_team,
                        status: status,
                    },
                });
                const team1Ids = matchValue.match_participants
                    .filter((p) => p.team === 1 && p.user_id)
                    .map((p) => p.user_id!);
                const team2Ids = matchValue.match_participants
                    .filter((p) => p.team === 2 && p.user_id)
                    .map((p) => p.user_id!);
                await applyGlickoToMatch(
                    tx,
                    team1Ids,
                    team2Ids,
                    winner_team as 1 | 2,
                    matchValue.created_at!,
                );
                return updated;
            })
            : prisma.matches.update({
                where: { id },
                data: {
                    score_team_1: score1,
                    score_team_2: score2,
                    winner_team: winner_team,
                    status: status,
                },
            }));

        return NextResponse.json(updatedMatch);
    } catch (error) {
        console.error("Error updating match:", error);
        return NextResponse.json(
            { error: "Failed to update match" },
            { status: 500 }
        );
    }
}
