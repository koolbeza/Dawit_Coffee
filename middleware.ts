import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/admin-auth";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow login page and admin API routes through
  if (
    pathname === "/admin/login" ||
    pathname.startsWith("/api/admin/")
  ) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    const cookie = request.cookies.get(SESSION_COOKIE)?.value;
    const token = process.env.ADMIN_SESSION_TOKEN ?? "";

    if (!cookie || !token || cookie !== token) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/(.*)", "/api/admin/(.*)"],
};
