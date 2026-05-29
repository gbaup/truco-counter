import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withGroupMemberAuth, withGroupAdminAuth } from "@/lib/withAuth";
import { toGroupDetail } from "@/lib/mappers";

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

    return NextResponse.json({ success: true, group: toGroupDetail(group) });
  } catch (error) {
    console.error("Error fetching group:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
});

export const PATCH = withGroupAdminAuth(async (request, _session, context) => {
  try {
    const { id } = await (context.params as Promise<{ id: string }>);
    const body = await request.json().catch(() => null);
    const name = typeof body?.name === "string" ? body.name.trim() : "";

    if (name.length < 1 || name.length > 30) {
      return NextResponse.json(
        { success: false, error: "Invalid group name" },
        { status: 400 }
      );
    }

    const group = await prisma.groups.update({
      where: { id },
      data: { name },
    });

    return NextResponse.json({
      success: true,
      group: { id: group.id, name: group.name },
    });
  } catch (error) {
    console.error("Error updating group:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
});
