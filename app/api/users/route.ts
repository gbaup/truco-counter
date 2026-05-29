import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const groupId = searchParams.get("groupId");

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