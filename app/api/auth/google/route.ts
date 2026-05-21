import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { randomBytes } from "crypto";

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action") ?? "login";

    if (action === "link") {
        const session = await getSession();
        if (!session) {
            return NextResponse.redirect(new URL("/login", request.url));
        }
    }

    const nonce = randomBytes(16).toString("hex");
    const state = Buffer.from(JSON.stringify({ action, nonce })).toString("base64url");

    const params = new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`,
        response_type: "code",
        scope: "openid email",
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
