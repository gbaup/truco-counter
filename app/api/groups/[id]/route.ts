import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withGroupMemberAuth } from "@/lib/withAuth";

export const GET = withGroupMemberAuth(async (_request, _session, context) => {
  try {
    const { id } = await (context.params as Promise<{ id: string }>);

    const group = await prisma.groups.findUnique({
      where: { id },
      include: {
        memberships: {
          include: {
            users: {
              select: { id: true, username: true, name: true, last_name: true },
            },
          },
          orderBy: { joined_at: "asc" },
        },
        _count: { select: { memberships: true } },
      },
    });

    if (!group) {
      return NextResponse.json({ success: false, error: "Group not found" }, { status: 404 });
    }

    const members = group.memberships.map((m) => ({
      id: m.users!.id,
      username: m.users!.username,
      name: m.users!.name,
      last_name: m.users!.last_name,
      joined_at: m.joined_at,
      rating: m.rating,
      rating_deviation: m.rating_deviation,
      elo_rating: m.elo_rating,
    }));

    return NextResponse.json({
      success: true,
      group: {
        id: group.id,
        name: group.name,
        admin_id: group.admin_id,
        created_at: group.created_at,
        member_count: group._count.memberships,
        members,
      },
    });
  } catch (error) {
    console.error("Error fetching group:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
});
