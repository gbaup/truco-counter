import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function proxy(request: NextRequest) {
    const token = request.cookies.get("auth-token")?.value;
    const verifiedToken = token && (await verifyToken(token));

    const PUBLIC_API_PREFIXES = [
        "/api/auth/login",
        "/api/auth/google",
    ];

    if (!verifiedToken) {
        if (request.nextUrl.pathname.startsWith("/api/")) {
            const isPublic = PUBLIC_API_PREFIXES.some((prefix) =>
                request.nextUrl.pathname.startsWith(prefix)
            );
            if (isPublic) {
                return NextResponse.next();
            }
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        if (!request.nextUrl.pathname.startsWith("/login")) {
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
