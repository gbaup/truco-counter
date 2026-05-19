import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/withAuth";
import { Session } from "@/types/auth";
import { signToken } from "@/lib/auth";

const USERNAME_RE = /^[a-z0-9_]{3,20}$/;

export const PATCH = withAuth(async (request, session: Session) => {
  const body = await request.json();
  const username = (body.username as string)?.toLowerCase().trim();

  if (!username || !USERNAME_RE.test(username)) {
    return NextResponse.json({ error: "Invalid username" }, { status: 400 });
  }

  const existing = await prisma.users.findFirst({
    where: {
      username: { equals: username, mode: "insensitive" },
      NOT: { id: session.userId },
    },
  });
  if (existing) {
    return NextResponse.json({ field: "username", error: "taken" }, { status: 409 });
  }

  await prisma.users.update({ where: { id: session.userId }, data: { username } });

  const newToken = await signToken({
    userId: session.userId,
    username,
    role: session.role,
  });
  const response = NextResponse.json({ ok: true });
  response.cookies.set("auth-token", newToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24,
    path: "/",
  });
  return response;
});
