// /app/api/logout/route.ts
import { NextResponse } from "next/server";
import { serialize } from "cookie";

const COOKIE_NAME = "hc_token";

export async function POST() {
  const cookie = serialize(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  const res = NextResponse.json({ ok: true });
  res.headers.set("Set-Cookie", cookie);
  return res;
}
