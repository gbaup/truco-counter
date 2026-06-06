import { NextResponse } from "next/server";
import { withGroupAdminAuth } from "@/lib/withAuth";
import { createToken } from "@/lib/inviteTokens";
import { Session } from "@/types/auth";

export const POST = withGroupAdminAuth(async (_request: Request, session: Session, context) => {
  try {
    const { id: groupId } = await (context.params as Promise<{ id: string }>);
    const appUrl = process.env.NEXT_PUBLIC_APP_URL!;
    const inviteToken = await createToken(groupId, session.userId);
    return NextResponse.json({
      success: true,
      token: inviteToken,
      joinUrl: `${appUrl}/join/${inviteToken.token}`,
    });
  } catch (error) {
    console.error("Error generating invite token:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
});
