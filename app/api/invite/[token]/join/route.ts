import { NextResponse } from "next/server";
import { withAuth } from "@/lib/withAuth";
import { joinGroupWithToken } from "@/lib/inviteTokens";
import { Session } from "@/types/auth";

export const POST = withAuth(async (_request: Request, session: Session, context) => {
  try {
    const { token } = await (context.params as Promise<{ token: string }>);
    const result = await joinGroupWithToken(session.userId, token);

    if (result === "invalid_token") {
      return NextResponse.json({ success: false, error: "Invalid or revoked invite link" }, { status: 404 });
    }

    if (result === "already_member") {
      return NextResponse.json({ success: false, error: "Already a member of this group" }, { status: 409 });
    }

    if (result === "group_full") {
      return NextResponse.json({ success: false, error: "Group is full", errorCode: "group_full" }, { status: 422 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error joining group:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
});
