import { NextResponse } from "next/server";
import { withGroupAdminAuth } from "@/lib/withAuth";
import { revokeToken } from "@/lib/inviteTokens";

export const DELETE = withGroupAdminAuth(async (_request, _session, context) => {
  try {
    const { tokenId } = await (context.params as Promise<{ id: string; tokenId: string }>);
    const result = await revokeToken(tokenId);
    if (result.notFound) {
      return NextResponse.json({ success: false, error: "Token not found" }, { status: 404 });
    }
    if (result.alreadyRevoked) {
      return NextResponse.json({ success: false, error: "Token already revoked" }, { status: 409 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error revoking invite token:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
});
