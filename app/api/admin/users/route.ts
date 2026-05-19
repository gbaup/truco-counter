import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { withAdminAuth } from "@/lib/withAuth";
import { USERNAME_RE, NAME_RE } from "@/lib/validators";

export const GET = withAdminAuth(async () => {
  const users = await prisma.users.findMany({
    select: {
      id: true,
      name: true,
      last_name: true,
      username: true,
      rating: true,
      rating_deviation: true,
      role: true,
    },
    orderBy: { username: "asc" },
  });
  return NextResponse.json(users);
});

export const POST = withAdminAuth(async (request) => {
  const body = await request.json();
  const firstName = (body.firstName as string)?.trim();
  const lastName = (body.lastName as string)?.trim();
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

  const passwordHash = await bcrypt.hash(
    process.env.INITIAL_USER_PASSWORD ?? "truco1234",
    10
  );

  await prisma.users.create({
    data: {
      name: firstName,
      last_name: lastName,
      username,
      password: passwordHash,
      role: "user",
      password_changed: false,
      rating: 1500,
      rating_deviation: 350,
      elo_rating: 1200,
    },
  });

  return NextResponse.json({ ok: true }, { status: 201 });
});
