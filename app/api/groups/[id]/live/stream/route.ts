import { prisma } from "@/lib/prisma";
import { withGroupMemberAuth } from "@/lib/withAuth";
import { Session } from "@/types/auth";
import { formatLivePayload } from "@/lib/domain/match";

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

  return formatLivePayload(match);
}

export const GET = withGroupMemberAuth<{ params: Promise<{ id: string }> }>(
  async (request: Request, _session: Session, { params }) => {
    const { id: groupId } = await params;

    const group = await prisma.groups.findUnique({ where: { id: groupId }, select: { features: true } });
    const features = (group?.features ?? {}) as { liveMatch?: boolean };
    if (!features.liveMatch) {
      return new Response("Feature disabled", { status: 403 });
    }
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
