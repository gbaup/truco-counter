import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { applyRatingsToMatch } from "@/lib/applyRatingsToMatch";
import { Session } from "@/types/auth";
import { CreateMatchDto } from "@/types/match";
import { withAuth, assertGroupMember } from "@/lib/withAuth";
import { getSession } from "@/lib/auth";

export const POST = withAuth(async (request, session: Session) => {
    try {
        const body: CreateMatchDto = await request.json();
        const { score1, score2, team1, team2, winner_team, status, groupId, maxPoints } = body;

        if (!team1 || team1.length === 0 || !team2 || team2.length === 0) {
            return NextResponse.json(
                { success: false, error: "Both teams must have at least one player" },
                { status: 400 }
            );
        }

        if (groupId) {
            const allPlayerIds = [...team1, ...team2].map((u) => u.id);
            const memberIds = await prisma.group_memberships
                .findMany({
                    where: { group_id: groupId, user_id: { in: [session.userId, ...allPlayerIds] } },
                    select: { user_id: true },
                })
                .then((rows) => new Set(rows.map((r) => r.user_id)));

            if (!memberIds.has(session.userId)) {
                return NextResponse.json(
                    { success: false, error: "You are not a member of this group" },
                    { status: 403 }
                );
            }
            const nonMembers = allPlayerIds.filter((id) => !memberIds.has(id));
            if (nonMembers.length > 0) {
                return NextResponse.json(
                    { success: false, error: "All players must be members of the group" },
                    { status: 400 }
                );
            }
        }

        const allPlayerIds = [...team1, ...team2].map(user => user.id);

        const existingMatch = await prisma.matches.findFirst({
            where: {
                status: "ongoing",
                match_participants: {
                    some: { user_id: { in: allPlayerIds } }
                }
            },
            include: { match_participants: true }
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
                (winner_team !== 1 && winner_team !== 2)
            ) {
                return NextResponse.json(
                    { error: "Missing required match data for finished match (score1, score2, winner_team must be 1 or 2)" },
                    { status: 400 }
                );
            }
        }

        const team1Ids = team1.map((u) => u.id);
        const team2Ids = team2.map((u) => u.id);

        const match = await (matchStatus === "finished"
            ? prisma.$transaction(async (tx) => {
                const created = await tx.matches.create({
                    data: {
                        score_team_1: score1 ?? 0,
                        score_team_2: score2 ?? 0,
                        winner_team: winner_team,
                        status: matchStatus,
                        created_by: session.userId,
                        group_id: groupId ?? null,
                        max_points: maxPoints ?? null,
                        match_participants: {
                            create: [
                                ...team1Ids.map((id) => ({ user_id: id, team: 1 })),
                                ...team2Ids.map((id) => ({ user_id: id, team: 2 })),
                            ],
                        },
                    },
                });
                await applyRatingsToMatch(
                    tx,
                    team1Ids,
                    team2Ids,
                    winner_team as 1 | 2,
                    created.created_at!,
                    created.id,
                    groupId ?? null,
                );
                return created;
            })
            : prisma.matches.create({
                data: {
                    score_team_1: score1 ?? 0,
                    score_team_2: score2 ?? 0,
                    winner_team: winner_team,
                    status: matchStatus,
                    created_by: session.userId,
                    group_id: groupId ?? null,
                    max_points: maxPoints ?? null,
                    match_participants: {
                        create: [
                            ...team1Ids.map((id) => ({ user_id: id, team: 1 })),
                            ...team2Ids.map((id) => ({ user_id: id, team: 2 })),
                        ],
                    },
                },
            }));

        return NextResponse.json(match);
    } catch (error) {
        console.error("Error saving match API:", error);
        return NextResponse.json(
            { error: "Failed to save match" },
            { status: 500 }
        );
    }
});

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");
        const groupId = searchParams.get("groupId");

        if (groupId) {
            const session = (await getSession()) as Session | null;
            if (!session?.userId) {
                return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
            }
            const rejection = await assertGroupMember(groupId, session.userId);
            if (rejection) return rejection;
        }

        const matches = await prisma.matches.findMany({
            where: {
                status: "finished",
                ...(userId ? { match_participants: { some: { user_id: userId } } } : {}),
                ...(groupId ? { group_id: groupId } : {}),
            },
            include: {
                match_participants: {
                    select: {
                        user_id: true,
                        team: true,
                        rating_change: true,
                        elo_rating_change: true,
                        users: { select: { username: true, name: true, last_name: true } },
                    },
                },
            },
            orderBy: { created_at: 'desc' }
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
