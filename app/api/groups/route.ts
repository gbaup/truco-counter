import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/withAuth";
import { Session } from "@/types/auth";
import { parseGroupFeatures } from "@/lib/domain/groupFeatures";

export const POST = withAuth(async (request: Request, session: Session) => {
  try {
    const { name } = await request.json();

    if (!name?.trim()) {
      return NextResponse.json({ success: false, error: "Group name is required" }, { status: 400 });
    }

    const group = await prisma.$transaction(async (tx) => {
      const created = await tx.groups.create({
        data: {
          name: name.trim(),
          admin_id: session.userId,
        },
      });
      await tx.group_memberships.create({
        data: {
          group_id: created.id,
          user_id: session.userId,
        },
      });
      return created;
    });

    return NextResponse.json({ success: true, group: { ...group, features: parseGroupFeatures(group.features) } }, { status: 201 });
  } catch (error) {
    console.error("Error creating group:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
});
