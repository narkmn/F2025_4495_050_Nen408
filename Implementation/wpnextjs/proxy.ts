// middleware
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  const token = req.cookies.get("hc_token")?.value;
  const { pathname } = req.nextUrl;

  const isProtectedPath = pathname.startsWith("/dashboard") 
    || pathname.startsWith("/my-courses");

  // If not logged in & trying to open protected page: redirect to login
  if (isProtectedPath && !token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("from", pathname); 
    return NextResponse.redirect(loginUrl);
  }

  // If logged in and go to /login or /signup, optional redirect to dashboard
  const isAuthPage = pathname === "/login" || pathname === "/signup";
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Otherwise, allow request
  return NextResponse.next();
}

// Configure which paths use this middleware
export const config = {
  matcher: ["/dashboard/:path*", "/course-list/:path*", "/login", "/signup"],
};
