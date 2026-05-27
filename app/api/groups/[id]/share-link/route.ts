import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withGroupMemberAuth } from "@/lib/withAuth";
import { randomBytes } from "crypto";
import { Session } from "@/types/auth";

export const GET = withGroupMemberAuth(async (_request: Request, session: Session, context) => {
  try {
    const { id: groupId } = await (context.params as Promise<{ id: string }>);
    const appUrl = process.env.NEXT_PUBLIC_APP_URL!;

    let activeToken = await prisma.invite_tokens.findFirst({
      where: { group_id: groupId, revoked_at: null },
      orderBy: { created_at: "asc" },
    });

    if (!activeToken) {
      const token = randomBytes(24).toString("base64url");
      activeToken = await prisma.invite_tokens.create({
        data: {
          group_id: groupId,
          created_by_user_id: session.userId,
          token,
        },
      });
    }

    return NextResponse.json({
      success: true,
      token: activeToken.token,
      joinUrl: `${appUrl}/join/${activeToken.token}`,
    });
  } catch (error) {
    console.error("Error fetching share link:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
});
