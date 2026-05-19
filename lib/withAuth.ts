import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { Session } from "@/types/auth";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/types/auth";

type AuthedHandler<TContext extends Record<string, unknown>> = (
  request: Request,
  session: Session,
  context: TContext
) => Promise<Response>;

export function withAuth<TContext extends Record<string, unknown> = Record<string, unknown>>(
  handler: AuthedHandler<TContext>
) {
  return async (request: Request, context: TContext): Promise<Response> => {
    const session = (await getSession()) as Session | null;
    if (!session?.userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    return handler(request, session, context);
  };
}

export function withAdminAuth<TContext extends Record<string, unknown> = Record<string, unknown>>(
  handler: AuthedHandler<TContext>
) {
  return async (request: Request, context: TContext): Promise<Response> => {
    const session = (await getSession()) as Session | null;
    if (!session?.userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    try {
      // Re-read role from DB so stale JWT claims don't affect admin access control
      const caller = await prisma.users.findUnique({
        where: { id: session.userId },
        select: { role: true },
      });
      if (caller?.role !== UserRole.admin) {
        return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
      }
      return handler(request, session, context);
    } catch {
      return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
    }
  };
}
