import { NextResponse } from "next/server";
import { Prisma } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { withAdminAuth } from "@/lib/withAuth";
import { Session } from "@/types/auth";
import { USERNAME_RE, isValidUUID } from "@/lib/validators";

export const PATCH = withAdminAuth<{ params: Promise<{ id: string }> }>(
  async (request, _session: Session, { params }) => {
    const { id } = await params;

    if (!isValidUUID(id)) {
      return NextResponse.json({ error: "Invalid user id" }, { status: 400 });
    }

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

    try {
      await prisma.users.update({ where: { id }, data: { username } });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === "P2025"
      ) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
      throw e;
    }
    return NextResponse.json({ ok: true });
  }
);
