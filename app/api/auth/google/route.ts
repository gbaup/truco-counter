import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { encodeOAuthState } from "@/lib/googleOAuth";

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action") ?? "login";
    const token = searchParams.get("token");

    if (action === "link") {
        const session = await getSession();
        if (!session) {
            return NextResponse.redirect(new URL("/login", request.url));
        }
    }

    const state = encodeOAuthState(action, token);

    const params = new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`,
        response_type: "code",
        scope: "openid email profile",
        state,
        access_type: "online",
    });

    const response = NextResponse.redirect(`${GOOGLE_AUTH_URL}?${params}`);
    response.cookies.set("oauth-state", state, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 10,
        path: "/",
        sameSite: "lax",
    });

    return response;
}
