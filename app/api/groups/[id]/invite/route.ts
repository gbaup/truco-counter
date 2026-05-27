import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withGroupAdminAuth } from "@/lib/withAuth";
import { randomBytes } from "crypto";
import { Session } from "@/types/auth";

export const POST = withGroupAdminAuth(async (_request: Request, session: Session, context) => {
  try {
    const { id: groupId } = await (context.params as Promise<{ id: string }>);
    const token = randomBytes(24).toString("base64url");
    const appUrl = process.env.NEXT_PUBLIC_APP_URL!;

    const inviteToken = await prisma.invite_tokens.create({
      data: {
        group_id: groupId,
        created_by_user_id: session.userId,
        token,
      },
    });

    return NextResponse.json({
      success: true,
      token: inviteToken,
      joinUrl: `${appUrl}/join/${token}`,
    });
  } catch (error) {
    console.error("Error generating invite token:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
});
