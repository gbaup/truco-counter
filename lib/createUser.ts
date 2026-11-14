import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";
import { USERNAME_RE } from "@/lib/validators";
import { INITIAL_USER_PASSWORD } from "@/lib/constants";
import { Prisma } from "@/lib/generated/prisma/client";
import { parseGroupFeatures, DEFAULT_MEMBER_LIMIT } from "@/lib/domain/groupFeatures";

export async function generateUsernameFromEmail(emailPrefix: string): Promise<string | null> {
  const base = emailPrefix
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "")
    .slice(0, 17);

  if (USERNAME_RE.test(base)) {
    const existing = await prisma.users.findUnique({ where: { username: base } });
    if (!existing) return base;
  }

  for (let i = 0; i < 5; i++) {
    const suffix = Math.floor(Math.random() * 900 + 100).toString();
    const candidate = `${base}${suffix}`;
    if (!USERNAME_RE.test(candidate)) continue;
    const existing = await prisma.users.findUnique({ where: { username: candidate } });
    if (!existing) return candidate;
  }
  return null;
}

export async function createUserWithPassword(params: {
  name: string;
  lastName: string;
  username: string;
  email: string | null;
  password: string;
}) {
  const hashedPassword = await bcrypt.hash(params.password, 10);
  return prisma.users.create({
    data: {
      name: params.name,
      last_name: params.lastName,
      username: params.username,
      email: params.email,
      password: hashedPassword,
      password_changed: true,
    },
  });
}

export async function createUserFromGoogle(params: {
  name: string;
  lastName: string;
  username: string;
  email: string;
  googleId: string;
}) {
  const passwordPlaceholder = await bcrypt.hash(randomBytes(16).toString("hex"), 10);
  return prisma.users.create({
    data: {
      name: params.name,
      last_name: params.lastName,
      username: params.username,
      email: params.email,
      password: passwordPlaceholder,
      password_changed: true,
      google_id: params.googleId,
    },
  });
}

export type CreateGroupPlayerResult =
  | { status: "created"; userId: string }
  | { status: "username_taken" }
  | { status: "group_not_found" }
  | { status: "group_full" };

/**
 * Creates a player on behalf of a group admin and adds them to that group in a
 * single transaction, so a player never exists without a group.
 */
export async function createGroupPlayer(params: {
  groupId: string;
  firstName: string;
  lastName: string;
  username: string;
}): Promise<CreateGroupPlayerResult> {
  const passwordHash = await bcrypt.hash(INITIAL_USER_PASSWORD, 10);

  try {
    return await prisma.$transaction(async (tx) => {
      const group = await tx.groups.findUnique({
        where: { id: params.groupId },
        select: { features: true },
      });
      if (!group) return { status: "group_not_found" } as const;

      const existing = await tx.users.findFirst({
        where: { username: { equals: params.username, mode: "insensitive" } },
        select: { id: true },
      });
      if (existing) return { status: "username_taken" } as const;

      const limit = parseGroupFeatures(group.features).memberLimit ?? DEFAULT_MEMBER_LIMIT;
      const memberCount = await tx.group_memberships.count({ where: { group_id: params.groupId } });
      if (memberCount >= limit) return { status: "group_full" } as const;

      const user = await tx.users.create({
        data: {
          name: params.firstName,
          last_name: params.lastName,
          username: params.username,
          password: passwordHash,
          role: "user",
          password_changed: false,
        },
        select: { id: true },
      });

      await tx.group_memberships.create({
        data: { group_id: params.groupId, user_id: user.id },
      });

      return { status: "created", userId: user.id } as const;
    }, { isolationLevel: "Serializable" });
  } catch (error) {
    // A concurrent insert can still win the unique username race.
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { status: "username_taken" };
    }
    throw error;
  }
}
