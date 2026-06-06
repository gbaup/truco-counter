import { NextResponse } from "next/server";
import { signToken, getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { exchangeCode, fetchGoogleUser, decodeOAuthState } from "@/lib/googleOAuth";
import { generateUsernameFromEmail, createUserFromGoogle } from "@/lib/createUser";
import { joinGroupWithToken } from "@/lib/inviteTokens";

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
  let inviteToken: string | null;
  try {
    ({ action, token: inviteToken } = decodeOAuthState(state));
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
        if (inviteToken) {
          const joinResult = await joinGroupWithToken(existingByGoogle.id, inviteToken);
          if (joinResult !== "joined") {
            console.warn(`OAuth invite join skipped (${joinResult}) for user ${existingByGoogle.id}`);
          }
        }
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
      const username = await generateUsernameFromEmail(emailPrefix);

      if (!username) {
        return redirect("/register?error=username_collision");
      }

      const name = (googleUser.given_name ?? emailPrefix).trim().toLowerCase();
      const lastName = (googleUser.family_name ?? "").trim().toLowerCase();

      const newUser = await createUserFromGoogle({
        name,
        lastName,
        username,
        email: googleUser.email.toLowerCase(),
        googleId: googleUser.id,
      });

      let joinedGroup = false;
      if (inviteToken) {
        const joinResult = await joinGroupWithToken(newUser.id, inviteToken);
        if (joinResult === "joined") {
          joinedGroup = true;
        } else {
          console.warn(`OAuth invite join skipped (${joinResult}) for new user ${newUser.id}`);
        }
      }

      const token = await signToken({ userId: newUser.id, username: newUser.username, role: newUser.role });
      const response = redirect(joinedGroup ? "/" : "/groups/new");
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
