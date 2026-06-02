import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAdminAuth } from "@/lib/withAuth";
import { USERNAME_RE, NAME_RE } from "@/lib/validators";
import { createUserAsAdmin } from "@/lib/createUser";

export const GET = withAdminAuth(async () => {
  const users = await prisma.users.findMany({
    select: {
      id: true,
      name: true,
      last_name: true,
      username: true,
      role: true,
    },
    orderBy: { username: "asc" },
  });
  return NextResponse.json(users);
});

export const POST = withAdminAuth(async (request) => {
  const body = await request.json();
  const firstName = (body.firstName as string)?.toLowerCase().trim();
  const lastName = (body.lastName as string)?.toLowerCase().trim();
  const username = (body.username as string)?.toLowerCase().trim();

  if (!firstName || !NAME_RE.test(firstName)) {
    return NextResponse.json({ error: "Invalid first name" }, { status: 400 });
  }
  if (!lastName || !NAME_RE.test(lastName)) {
    return NextResponse.json({ error: "Invalid last name" }, { status: 400 });
  }
  if (!username || !USERNAME_RE.test(username)) {
    return NextResponse.json({ field: "username", error: "Invalid username" }, { status: 400 });
  }

  const existing = await prisma.users.findFirst({
    where: { username: { equals: username, mode: "insensitive" } },
  });
  if (existing) {
    return NextResponse.json({ field: "username", error: "taken" }, { status: 409 });
  }

  await createUserAsAdmin({ firstName, lastName, username });

  return NextResponse.json({ ok: true }, { status: 201 });
});
