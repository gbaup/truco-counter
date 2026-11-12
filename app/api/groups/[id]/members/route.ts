import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withGroupMemberAuth, withGroupAdminAuth } from "@/lib/withAuth";
import { toGroupMember } from "@/lib/mappers";
import { USERNAME_RE, NAME_RE } from "@/lib/validators";
import { createGroupPlayer } from "@/lib/createUser";

const PAGE_SIZE = 20;

export const GET = withGroupMemberAuth(async (request, _session, context) => {
  try {
    const { id } = await (context.params as Promise<{ id: string }>);
    const { searchParams } = new URL(request.url);
    const all = searchParams.get("all") === "true";
    const page = all ? 1 : Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));

    const [memberships, total] = await Promise.all([
      prisma.group_memberships.findMany({
        where: { group_id: id },
        include: {
          users: {
            select: { id: true, username: true, name: true, last_name: true },
          },
        },
        orderBy: { joined_at: "asc" },
        ...(all ? {} : { skip: (page - 1) * PAGE_SIZE, take: PAGE_SIZE }),
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

export const POST = withGroupAdminAuth(async (request, _session, context) => {
  try {
    const { id: groupId } = await (context.params as Promise<{ id: string }>);
    const body = await request.json();
    const firstName = (body.firstName as string)?.toLowerCase().trim();
    const lastName = (body.lastName as string)?.toLowerCase().trim();
    const username = (body.username as string)?.toLowerCase().trim();

    if (!firstName || !NAME_RE.test(firstName)) {
      return NextResponse.json({ success: false, error: "Invalid first name" }, { status: 400 });
    }
    if (!lastName || !NAME_RE.test(lastName)) {
      return NextResponse.json({ success: false, error: "Invalid last name" }, { status: 400 });
    }
    if (!username || !USERNAME_RE.test(username)) {
      return NextResponse.json(
        { success: false, field: "username", error: "Invalid username" },
        { status: 400 }
      );
    }

    const result = await createGroupPlayer({ groupId, firstName, lastName, username });

    switch (result.status) {
      case "created":
        return NextResponse.json({ success: true, userId: result.userId }, { status: 201 });
      case "username_taken":
        return NextResponse.json(
          { success: false, field: "username", error: "taken" },
          { status: 409 }
        );
      case "group_full":
        return NextResponse.json(
          { success: false, code: "GROUP_FULL", error: "Group is full" },
          { status: 409 }
        );
      case "group_not_found":
        return NextResponse.json({ success: false, error: "Group not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error creating group player:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
});
