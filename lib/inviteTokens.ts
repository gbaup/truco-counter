import { prisma } from "@/lib/prisma";
import { randomBytes } from "crypto";
import { parseGroupFeatures, DEFAULT_MEMBER_LIMIT } from "@/lib/domain/groupFeatures";

const ROSTER_PREVIEW_LIMIT = 5;

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
            take: ROSTER_PREVIEW_LIMIT,
            orderBy: { joined_at: "asc" },
          },
        },
      },
    },
  });
  if (!record || record.revoked_at) return null;
  const features = parseGroupFeatures(record.groups.features);
  const limit = features.memberLimit ?? DEFAULT_MEMBER_LIMIT;
  const isFull = record.groups._count.memberships >= limit;
  return { ...record, isFull };
}

export async function joinGroupWithToken(
  userId: string,
  token: string,
): Promise<"joined" | "already_member" | "invalid_token" | "group_full"> {
  const record = await validateToken(token);
  if (!record) return "invalid_token";

  const features = parseGroupFeatures(record.groups.features);
  const limit = features.memberLimit ?? DEFAULT_MEMBER_LIMIT;

  return prisma.$transaction(async (tx) => {
    const existing = await tx.group_memberships.findUnique({
      where: { group_id_user_id: { group_id: record.group_id, user_id: userId } },
      select: { id: true },
    });
    if (existing) return "already_member";

    const memberCount = await tx.group_memberships.count({ where: { group_id: record.group_id } });
    if (memberCount >= limit) return "group_full";

    await tx.group_memberships.create({
      data: { group_id: record.group_id, user_id: userId },
    });
    return "joined";
  }, { isolationLevel: "Serializable" });
}

