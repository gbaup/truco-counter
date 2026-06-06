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

    if (
      typeof body.matchId !== "string" ||
      body.matchId.trim() === "" ||
      (body.action !== "append" && body.action !== "clear")
    ) {
      return NextResponse.json({ success: false, error: "Invalid request body" }, { status: 400 });
    }

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
      const h = body.hand;
      if (
        !h ||
        typeof h.id !== "string" || h.id.trim() === "" || h.id.length > 64 ||
        typeof h.us !== "number" || !Number.isInteger(h.us) || h.us < 0 ||
        typeof h.them !== "number" || !Number.isInteger(h.them) || h.them < 0 ||
        typeof h.ts !== "number" || !Number.isFinite(h.ts)
      ) {
        return NextResponse.json({ success: false, error: "Invalid hand" }, { status: 400 });
      }
      appendHand(body.matchId, h);
    }

    return NextResponse.json({ success: true });
  }
);
