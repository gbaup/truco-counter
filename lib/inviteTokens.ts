import { prisma } from "@/lib/prisma";
import { randomBytes } from "crypto";

function generateToken(): string {
  return randomBytes(24).toString("base64url");
}

export async function createToken(
  groupId: string,
  createdByUserId: string,
): Promise<{ id: string; token: string }> {
  return prisma.invite_tokens.create({
    data: {
      group_id: groupId,
      created_by_user_id: createdByUserId,
      token: generateToken(),
    },
  });
}

export async function findOrCreateShareToken(
  groupId: string,
  userId: string,
): Promise<{ id: string; token: string }> {
  return prisma.$transaction(
    async (tx) => {
      const existing = await tx.invite_tokens.findFirst({
        where: { group_id: groupId, revoked_at: null },
        orderBy: { created_at: "asc" },
      });
      if (existing) return existing;
      return tx.invite_tokens.create({
        data: {
          group_id: groupId,
          created_by_user_id: userId,
          token: generateToken(),
        },
      });
    },
    { isolationLevel: "Serializable" },
  );
}

export async function validateToken(token: string) {
  const record = await prisma.invite_tokens.findUnique({
    where: { token },
    include: {
      groups: {
        include: {
          _count: { select: { memberships: true } },
          admin: { select: { name: true, username: true } },
          memberships: {
            select: { users: { select: { name: true, username: true } } },
            take: 5,
            orderBy: { joined_at: "asc" },
          },
        },
      },
    },
  });
  if (!record || record.revoked_at) return null;
  return record;
}

export async function joinGroupWithToken(
  userId: string,
  token: string,
): Promise<"joined" | "already_member" | "invalid_token"> {
  const record = await validateToken(token);
  if (!record) return "invalid_token";

  const existing = await prisma.group_memberships.findUnique({
    where: { group_id_user_id: { group_id: record.group_id, user_id: userId } },
    select: { id: true },
  });
  if (existing) return "already_member";

  await prisma.group_memberships.create({
    data: { group_id: record.group_id, user_id: userId },
  });
  return "joined";
}

export async function revokeToken(
  tokenId: string,
): Promise<{ notFound: boolean; alreadyRevoked: boolean }> {
  const existing = await prisma.invite_tokens.findUnique({
    where: { id: tokenId },
    select: { revoked_at: true },
  });
  if (!existing) return { notFound: true, alreadyRevoked: false };
  if (existing.revoked_at) return { notFound: false, alreadyRevoked: true };
  await prisma.invite_tokens.update({
    where: { id: tokenId },
    data: { revoked_at: new Date() },
  });
  return { notFound: false, alreadyRevoked: false };
}
