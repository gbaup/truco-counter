import { NextResponse } from "next/server";
import { validateToken } from "@/lib/inviteTokens";

export async function GET(_request: Request, { params }: { params: Promise<{ token: string }> }) {
  try {
    const { token } = await params;
    const record = await validateToken(token);
    if (!record) {
      return NextResponse.json({ success: false, error: "Invalid or revoked invite link" }, { status: 404 });
    }
    return NextResponse.json({
      success: true,
      group: {
        id: record.groups.id,
        name: record.groups.name,
        memberCount: record.groups._count.memberships,
        createdByName: record.groups.admin.name,
      },
    });
  } catch (error) {
    console.error("Error validating invite token:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
