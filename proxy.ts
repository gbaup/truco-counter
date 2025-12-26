import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Define paths that are public
  const isPublicPath = path === "/login";

  // Check for the auth cookie
  const token = request.cookies.get("auth-token")?.value || "";

  if (isPublicPath && token) {
    // If logged in and trying to access login, redirect to home
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!isPublicPath && !token) {
    // If not logged in and trying to access protected route, redirect to login
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
