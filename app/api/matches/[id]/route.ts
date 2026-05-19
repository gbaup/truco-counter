import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { applyRatingsToMatch, extractTeamIds } from "@/lib/applyRatingsToMatch";
import { isTransitioningToFinished } from "@/lib/domain/match";
import { Session } from "@/types/auth";
import { UpdateMatchDto } from "@/types/match";
import { withAuth } from "@/lib/withAuth";

export const PATCH = withAuth<{ params: Promise<{ id: string }> }>(
    async (request, session: Session, { params }) => {
        try {
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

            const isFinishing = isTransitioningToFinished(
                matchValue.status,
                status ?? ""
            );

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
                    const { team1Ids, team2Ids } = extractTeamIds(matchValue.match_participants);
                    await applyRatingsToMatch(
                        tx,
                        team1Ids,
                        team2Ids,
                        winner_team as 1 | 2,
                        matchValue.created_at!,
                        id,
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
);
