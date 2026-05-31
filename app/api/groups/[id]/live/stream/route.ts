import { prisma } from "@/lib/prisma";
import { withGroupMemberAuth } from "@/lib/withAuth";
import { Session } from "@/types/auth";

async function getMatchPayload(groupId: string) {
  const match = await prisma.matches.findFirst({
    where: { group_id: groupId, status: "ongoing" },
    include: {
      users: { select: { username: true, name: true } },
      match_participants: {
        include: { users: { select: { username: true, name: true } } },
      },
    },
    orderBy: { created_at: "desc" },
  });

  if (!match) return { live: null };

  const team1 = match.match_participants
    .filter((p) => p.team === 1)
    .map((p) => p.users?.name ?? p.users?.username ?? "?");

  const team2 = match.match_participants
    .filter((p) => p.team === 2)
    .map((p) => p.users?.name ?? p.users?.username ?? "?");

  return {
    live: {
      matchId: match.id,
      scoreUs: match.score_team_1 ?? 0,
      scoreThem: match.score_team_2 ?? 0,
      max: match.max_points ?? 30,
      teamUs: team1,
      teamThem: team2,
      scorer: match.users?.name ?? match.users?.username ?? "?",
    },
  };
}

export const GET = withGroupMemberAuth<{ params: Promise<{ id: string }> }>(
  async (request: Request, _session: Session, { params }) => {
    const { id: groupId } = await params;
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        const send = async () => {
          try {
            const payload = await getMatchPayload(groupId);
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`));
          } catch {
            // skip on transient DB error — next interval will retry
          }
        };

        await send();

        const interval = setInterval(send, 3000);

        request.signal.addEventListener("abort", () => {
          clearInterval(interval);
          controller.close();
        });
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        "Connection": "keep-alive",
        "X-Accel-Buffering": "no",
      },
    });
  }
);
