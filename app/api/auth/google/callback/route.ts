import { NextResponse } from "next/server";
import { signToken, getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { exchangeCode, fetchGoogleUser } from "@/lib/googleOAuth";
import { randomBytes } from "crypto";
import { USERNAME_RE } from "@/lib/validators";

async function generateUsername(emailPrefix: string): Promise<string | null> {
  const base = emailPrefix
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "")
    .slice(0, 17);

  // Try the clean prefix first (no suffix)
  if (USERNAME_RE.test(base)) {
    const existing = await prisma.users.findUnique({ where: { username: base } });
    if (!existing) return base;
  }

  // Fall back to suffix on collision
  for (let i = 0; i < 3; i++) {
    const suffix = Math.floor(Math.random() * 900 + 100).toString();
    const candidate = `${base.slice(0, 17)}${suffix}`;
    if (!USERNAME_RE.test(candidate)) continue;
    const existing = await prisma.users.findUnique({ where: { username: candidate } });
    if (!existing) return candidate;
  }
  return null;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const appUrl = process.env.NEXT_PUBLIC_APP_URL!;

  const cookieStore = await cookies();
  const savedState = cookieStore.get("oauth-state")?.value;

  function redirect(path: string) {
    const res = NextResponse.redirect(`${appUrl}${path}`);
    res.cookies.set("oauth-state", "", { maxAge: 0, path: "/" });
    return res;
  }

  const providerError = searchParams.get("error");
  if (providerError) {
    return redirect("/login?error=oauth_cancelled");
  }

  if (!code || !state || state !== savedState) {
    return redirect("/login?error=oauth_state_mismatch");
  }

  let action: string;
  try {
    const parsed = JSON.parse(Buffer.from(state, "base64url").toString());
    action = parsed.action ?? "login";
  } catch {
    return redirect("/login?error=oauth_invalid_state");
  }

  try {
    const accessToken = await exchangeCode(code);
    const googleUser = await fetchGoogleUser(accessToken);

    if (action === "link") {
      const session = await getSession();
      if (!session) {
        return redirect("/login?error=not_authenticated");
      }

      const existing = await prisma.users.findUnique({
        where: { google_id: googleUser.id },
      });
      if (existing && existing.id !== session.userId) {
        return redirect("/profile?error=google_already_linked");
      }

      await prisma.users.update({
        where: { id: session.userId as string },
        data: { google_id: googleUser.id },
      });

      return redirect("/profile?linked=true");
    }

    if (action === "register" && process.env.NEXT_PUBLIC_ENABLE_REGISTRATION === "false") {
      return redirect("/login?error=registration_disabled");
    }

    if (action === "register") {
      const existingByGoogle = await prisma.users.findUnique({
        where: { google_id: googleUser.id },
      });

      if (existingByGoogle) {
        // Google account already linked — treat as a login
        const token = await signToken({
          userId: existingByGoogle.id,
          username: existingByGoogle.username,
          role: existingByGoogle.role,
        });
        const response = redirect("/");
        response.cookies.set("auth-token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 60 * 60 * 24,
          path: "/",
        });
        return response;
      }

      const emailPrefix = googleUser.email.split("@")[0];
      const username = await generateUsername(emailPrefix);

      if (!username) {
        return redirect("/register?error=username_collision");
      }

      const name = (googleUser.given_name ?? emailPrefix).trim().toLowerCase();
      const lastName = (googleUser.family_name ?? "").trim().toLowerCase();

      // Derive a random 16-byte password placeholder — user never needs to know it
      const passwordPlaceholder = randomBytes(16).toString("hex");

      const newUser = await prisma.users.create({
        data: {
          name,
          last_name: lastName,
          username,
          email: googleUser.email.toLowerCase(),
          password: passwordPlaceholder,
          password_changed: true,
          google_id: googleUser.id,
        },
      });

      const token = await signToken({ userId: newUser.id, username: newUser.username, role: newUser.role });
      const response = redirect("/groups/new");
      response.cookies.set("auth-token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24,
        path: "/",
      });
      return response;
    }

    // action === "login"
    const user = await prisma.users.findUnique({
      where: { google_id: googleUser.id },
    });

    if (!user) {
      return redirect("/login?error=not_linked");
    }

    const token = await signToken({ userId: user.id, username: user.username, role: user.role });
    const response = redirect("/");
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("Google OAuth callback error:", err);
    const fallback = action === "link" ? "/profile?error=oauth_error" : "/login?error=oauth_error";
    return redirect(fallback);
  }
}
