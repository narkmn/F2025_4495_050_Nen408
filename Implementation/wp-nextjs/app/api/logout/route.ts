// app/api/logout/route.ts
import { NextResponse } from "next/server";
import { serialize } from "cookie";

const COOKIE_NAME = "hc_token";   // ← Must be exactly the same as in login

export async function POST() {
  // We clear the cookie by setting maxAge = 0 (or a negative value)
  const cookie = serialize(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: -1,               // Immediately expire
    // you can also use expires: new Date(0) if you prefer
  });

  const response = NextResponse.json({ ok: true, message: "Logged out" });
  response.headers.set("Set-Cookie", cookie);

  return response;
}

// Optional: allow GET as well for simple <a href="/api/logout"> links or redirects
export async function GET() {
  return POST();
}