import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_request: Request, { params }: { params: Promise<{ token: string }> }) {
  try {
    const { token } = await params;

    const inviteToken = await prisma.invite_tokens.findUnique({
      where: { token },
      include: {
        groups: {
          include: {
            _count: { select: { memberships: true } },
            admin: { select: { name: true } },
          },
        },
      },
    });

    if (!inviteToken || inviteToken.revoked_at) {
      return NextResponse.json({ success: false, error: "Invalid or revoked invite link" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      group: {
        id: inviteToken.groups.id,
        name: inviteToken.groups.name,
        memberCount: inviteToken.groups._count.memberships,
        createdByName: inviteToken.groups.admin.name,
      },
    });
  } catch (error) {
    console.error("Error validating invite token:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
