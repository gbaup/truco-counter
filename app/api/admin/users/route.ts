import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAdminAuth } from "@/lib/withAuth";

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
