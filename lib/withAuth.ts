import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { Session, UserRole } from "@/types/auth";
import { prisma } from "@/lib/prisma";
import { parseGroupFeatures, type GroupFeatures } from "@/lib/domain/groupFeatures";

type AuthedHandler<TContext extends Record<string, unknown>> = (
  request: Request,
  session: Session,
  context: TContext
) => Promise<Response>;

type AuthPredicate<TContext extends Record<string, unknown>> = (
  session: Session,
  context: TContext,
) => Promise<Response | null>;

function withAuthCore<TContext extends Record<string, unknown> = Record<string, unknown>>(
  handler: AuthedHandler<TContext>,
  authorize?: AuthPredicate<TContext>,
) {
  return async (request: Request, context: TContext): Promise<Response> => {
    const session = (await getSession()) as Session | null;
    if (!session?.userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    if (authorize) {
      try {
        const rejection = await authorize(session, context);
        if (rejection) return rejection;
      } catch {
        return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
      }
    }
    return handler(request, session, context);
  };
}

export function withAuth<TContext extends Record<string, unknown> = Record<string, unknown>>(
  handler: AuthedHandler<TContext>
) {
  return withAuthCore(handler);
}

export function withAdminAuth<TContext extends Record<string, unknown> = Record<string, unknown>>(
  handler: AuthedHandler<TContext>
) {
  return withAuthCore(handler, async (session) => {
    const caller = await prisma.users.findUnique({
      where: { id: session.userId },
      select: { role: true },
    });
    if (caller?.role !== UserRole.admin) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }
    return null;
  });
}

export async function assertGroupMember(groupId: string, userId: string): Promise<Response | null> {
  const membership = await prisma.group_memberships.findUnique({
    where: { group_id_user_id: { group_id: groupId, user_id: userId } },
  });
  if (!membership) {
    return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
  }
  return null;
}

export async function assertGroupAdmin(groupId: string, userId: string): Promise<Response | null> {
  const group = await prisma.groups.findUnique({
    where: { id: groupId },
    select: { admin_id: true },
  });
  if (!group) {
    return NextResponse.json({ success: false, error: "Group not found" }, { status: 404 });
  }
  if (group.admin_id !== userId) {
    return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
  }
  return null;
}

export function withGroupMemberAuth<TContext extends Record<string, unknown> = Record<string, unknown>>(
  handler: AuthedHandler<TContext>
) {
  return withAuthCore(handler, async (session, context) => {
    const { id: groupId } = await (context.params as Promise<{ id: string }>);
    return assertGroupMember(groupId, session.userId);
  });
}

export function withGroupAdminAuth<TContext extends Record<string, unknown> = Record<string, unknown>>(
  handler: AuthedHandler<TContext>
) {
  return withAuthCore(handler, async (session, context) => {
    const { id: groupId } = await (context.params as Promise<{ id: string }>);
    return assertGroupAdmin(groupId, session.userId);
  });
}

export function withGroupMemberFeatureAuth<TContext extends Record<string, unknown> = Record<string, unknown>>(
  feature: keyof GroupFeatures,
  handler: AuthedHandler<TContext>
) {
  return withAuthCore(handler, async (session, context) => {
    const { id: groupId } = await (context.params as Promise<{ id: string }>);
    const memberRejection = await assertGroupMember(groupId, session.userId);
    if (memberRejection) return memberRejection;
    const group = await prisma.groups.findUnique({ where: { id: groupId }, select: { features: true } });
    if (!group) {
      return NextResponse.json({ success: false, error: "Group not found" }, { status: 404 });
    }
    const features = parseGroupFeatures(group.features);
    if (!features[feature]) {
      return NextResponse.json({ success: false, error: "Feature disabled" }, { status: 403 });
    }
    return null;
  });
}
