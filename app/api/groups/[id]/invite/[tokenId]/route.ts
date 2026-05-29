import { NextResponse } from "next/server";
import { withGroupAdminAuth } from "@/lib/withAuth";
import { prisma } from "@/lib/prisma";

export const DELETE = withGroupAdminAuth(async (_request, _session, context) => {
  try {
    const { id: groupId, tokenId } = await (context.params as Promise<{ id: string; tokenId: string }>);

    const existing = await prisma.invite_tokens.findUnique({
      where: { id: tokenId },
      select: { group_id: true, revoked_at: true },
    });

    if (!existing) {
      return NextResponse.json({ success: false, error: "Token not found" }, { status: 404 });
    }
    if (existing.group_id !== groupId) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }
    if (existing.revoked_at) {
      return NextResponse.json({ success: false, error: "Token already revoked" }, { status: 409 });
    }

    await prisma.invite_tokens.update({
      where: { id: tokenId },
      data: { revoked_at: new Date() },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error revoking invite token:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
});
