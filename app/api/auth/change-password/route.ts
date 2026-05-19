import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/withAuth";
import { Session } from "@/types/auth";

export const POST = withAuth(async (request, session: Session) => {
  const body = await request.json();
  const { current, next } = body as { current?: string; next?: string };

  if (!current || !next) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  if (next.length < 6) {
    return NextResponse.json({ error: "too_short" }, { status: 400 });
  }

  const user = await prisma.users.findUnique({ where: { id: session.userId } });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const valid = await bcrypt.compare(current, user.password);
  if (!valid) {
    return NextResponse.json({ error: "wrong_password" }, { status: 401 });
  }

  const passwordHash = await bcrypt.hash(next, 10);
  await prisma.users.update({
    where: { id: session.userId },
    data: { password: passwordHash, password_changed: true },
  });

  return NextResponse.json({ ok: true });
});
