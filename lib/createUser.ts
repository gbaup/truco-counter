import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";
import { USERNAME_RE } from "@/lib/validators";
import { INITIAL_USER_PASSWORD } from "@/lib/constants";

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

export async function createUserAsAdmin(params: {
  firstName: string;
  lastName: string;
  username: string;
}) {
  const passwordHash = await bcrypt.hash(INITIAL_USER_PASSWORD, 10);
  return prisma.users.create({
    data: {
      name: params.firstName,
      last_name: params.lastName,
      username: params.username,
      password: passwordHash,
      role: "user",
      password_changed: false,
    },
  });
}
