import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withGroupMemberAuth } from "@/lib/withAuth";
import { toGroupMember } from "@/lib/mappers";

const PAGE_SIZE = 20;

export const GET = withGroupMemberAuth(async (request, _session, context) => {
  try {
    const { id } = await (context.params as Promise<{ id: string }>);
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));

    const [memberships, total] = await Promise.all([
      prisma.group_memberships.findMany({
        where: { group_id: id },
        include: {
          users: {
            select: { id: true, username: true, name: true, last_name: true },
          },
        },
        orderBy: { joined_at: "asc" },
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
      }),
      prisma.group_memberships.count({ where: { group_id: id } }),
    ]);

    const members = memberships.map(toGroupMember);

    return NextResponse.json({
      success: true,
      members,
      total,
      page,
      pages: Math.ceil(total / PAGE_SIZE),
    });
  } catch (error) {
    console.error("Error fetching group members:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
});
