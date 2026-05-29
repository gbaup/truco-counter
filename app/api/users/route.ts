import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { assertGroupMember } from "@/lib/withAuth";
import { Session } from "@/types/auth";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const groupId = searchParams.get("groupId");

        if (groupId) {
            const session = (await getSession()) as Session | null;
            if (!session?.userId) {
                return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
            }
            const rejection = await assertGroupMember(groupId, session.userId);
            if (rejection) return rejection;
        }

        const users = await prisma.users.findMany({
            where: groupId
                ? { group_memberships: { some: { group_id: groupId } } }
                : undefined,
            select: {
                id: true,
                name: true,
                username: true,
                _count: {
                    select: {
                        match_participants: {
                            where: {
                                matches: {
                                    status: "ongoing",
                                },
                            },
                        },
                    },
                },
            },
        });

        const usersWithStatus = users.map((user) => ({
            id: user.id,
            name: user.name,
            username: user.username,
            isPlaying: user._count.match_participants > 0,
        }));

        return NextResponse.json(usersWithStatus);

    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}