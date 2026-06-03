import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withGroupMemberFeatureAuth } from "@/lib/withAuth";
import { appendHand, clearLog } from "@/lib/liveStore";
import { Session } from "@/types/auth";
import { Hand } from "@/types/match";

type Body =
  | { action: "append"; matchId: string; hand: Hand }
  | { action: "clear"; matchId: string };

export const POST = withGroupMemberFeatureAuth<{ params: Promise<{ id: string }> }>(
  "liveMatch",
  async (request: Request, session: Session, { params }) => {
    const { id: groupId } = await params;
    const body = (await request.json()) as Body;

    const match = await prisma.matches.findFirst({
      where: { id: body.matchId, group_id: groupId, status: "ongoing" },
      select: { created_by: true },
    });

    if (!match) {
      return NextResponse.json({ success: false, error: "Match not found" }, { status: 404 });
    }

    if (match.created_by !== session.userId) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    if (body.action === "clear") {
      clearLog(body.matchId);
    } else {
      appendHand(body.matchId, body.hand);
    }

    return NextResponse.json({ success: true });
  }
);
