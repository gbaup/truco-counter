import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/withAuth";
import { Session } from "@/types/auth";

export const GET = withAuth(async (_request: Request, session: Session) => {
  try {
    const memberships = await prisma.group_memberships.findMany({
      where: { user_id: session.userId },
      include: {
        groups: {
          include: {
            _count: { select: { memberships: true } },
          },
        },
      },
      orderBy: { joined_at: "asc" },
    });

    const groups = memberships.map(({ groups: g, joined_at }) => ({
      id: g.id,
      name: g.name,
      admin_id: g.admin_id,
      created_at: g.created_at,
      features: g.features ?? {},
      member_count: g._count.memberships,
      joined_at,
    }));

    return NextResponse.json({ success: true, groups });
  } catch (error) {
    console.error("Error fetching user groups:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
});
