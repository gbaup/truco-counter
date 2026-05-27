import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function proxy(request: NextRequest) {
    const token = request.cookies.get("auth-token")?.value;
    const verifiedToken = token && (await verifyToken(token));

    const PUBLIC_API_PATHS = [
        "/api/auth/login",
        "/api/auth/google",
        "/api/auth/google/callback",
        "/api/auth/register",
    ];

    const PUBLIC_API_PREFIXES = [
        "/api/auth/google",
        "/api/invite/",
    ];

    const PUBLIC_PAGE_PATHS = [
        "/login",
        "/register",
    ];

    const PUBLIC_PAGE_PREFIXES = [
        "/join/",
    ];

    if (!verifiedToken) {
        if (request.nextUrl.pathname.startsWith("/api/")) {
            const isPublic =
                PUBLIC_API_PATHS.includes(request.nextUrl.pathname) ||
                PUBLIC_API_PREFIXES.some((p) => request.nextUrl.pathname.startsWith(p));
            if (isPublic) {
                return NextResponse.next();
            }
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const isPublicPage =
            PUBLIC_PAGE_PATHS.some((p) => request.nextUrl.pathname === p) ||
            PUBLIC_PAGE_PREFIXES.some((p) => request.nextUrl.pathname.startsWith(p));

        if (!isPublicPage) {
            return NextResponse.redirect(new URL("/login", request.url));
        }
    }

    if (verifiedToken && request.nextUrl.pathname.startsWith("/login")) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
