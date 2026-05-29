import { NextResponse } from "next/server";
import { withGroupMemberAuth } from "@/lib/withAuth";
import { findOrCreateShareToken } from "@/lib/inviteTokens";
import { Session } from "@/types/auth";

export const GET = withGroupMemberAuth(async (_request: Request, session: Session, context) => {
  try {
    const { id: groupId } = await (context.params as Promise<{ id: string }>);
    const appUrl = process.env.NEXT_PUBLIC_APP_URL!;

    const activeToken = await findOrCreateShareToken(groupId, session.userId);

    return NextResponse.json({
      success: true,
      tokenId: activeToken.id,
      token: activeToken.token,
      joinUrl: `${appUrl}/join/${activeToken.token}`,
    });
  } catch (error) {
    console.error("Error fetching share link:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
});
