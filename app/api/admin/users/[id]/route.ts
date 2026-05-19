import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAdminAuth } from "@/lib/withAuth";
import { Session } from "@/types/auth";

const USERNAME_RE = /^[a-z0-9_]{3,20}$/;

export const PATCH = withAdminAuth<{ params: Promise<{ id: string }> }>(
  async (request, _session: Session, { params }) => {
    const { id } = await params;
    const body = await request.json();
    const username = (body.username as string)?.toLowerCase().trim();

    if (!username || !USERNAME_RE.test(username)) {
      return NextResponse.json({ error: "Invalid username" }, { status: 400 });
    }

    const existing = await prisma.users.findFirst({
      where: {
        username: { equals: username, mode: "insensitive" },
        NOT: { id },
      },
    });
    if (existing) {
      return NextResponse.json({ field: "username", error: "taken" }, { status: 409 });
    }

    await prisma.users.update({ where: { id }, data: { username } });
    return NextResponse.json({ ok: true });
  }
);
