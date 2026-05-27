import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/withAuth";
import { Session } from "@/types/auth";

export const POST = withAuth(async (_request: Request, session: Session, context) => {
  try {
    const { token } = await (context.params as Promise<{ token: string }>);

    const inviteToken = await prisma.invite_tokens.findUnique({
      where: { token },
      include: { groups: true },
    });

    if (!inviteToken || inviteToken.revoked_at) {
      return NextResponse.json({ success: false, error: "Invalid or revoked invite link" }, { status: 404 });
    }

    const existing = await prisma.group_memberships.findUnique({
      where: {
        group_id_user_id: { group_id: inviteToken.group_id, user_id: session.userId },
      },
    });

    if (existing) {
      return NextResponse.json({ success: false, error: "Already a member of this group" }, { status: 409 });
    }

    await prisma.group_memberships.create({
      data: {
        group_id: inviteToken.group_id,
        user_id: session.userId,
      },
    });

    return NextResponse.json({
      success: true,
      groupId: inviteToken.group_id,
      groupName: inviteToken.groups.name,
    });
  } catch (error) {
    console.error("Error joining group:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
});
