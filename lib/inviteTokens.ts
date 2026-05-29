import { prisma } from "@/lib/prisma";
import { randomBytes } from "crypto";

export async function findOrCreateShareToken(
  groupId: string,
  userId: string,
): Promise<{ id: string; token: string }> {
  const existing = await prisma.invite_tokens.findFirst({
    where: { group_id: groupId, revoked_at: null },
    orderBy: { created_at: "asc" },
  });

  if (existing) return existing;

  return prisma.invite_tokens.create({
    data: {
      group_id: groupId,
      created_by_user_id: userId,
      token: randomBytes(24).toString("base64url"),
    },
  });
}
