// /app/api/login/route.ts
import { NextResponse } from "next/server";
import { serialize } from "cookie";

const WP_TOKEN_URL = "https://healthacademy.ca/wp-json/jwt-auth/v1/token";
const COOKIE_NAME = "hc_token";
const TOKEN_MAX_AGE = 7 * 24 * 60 * 60; // 7 days

export async function POST(request: Request) {
  try {
    const { username, password, remember = false } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
    }

    const wpRes = await fetch(WP_TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const wpJson = await wpRes.json();

    if (!wpRes.ok) {
      return NextResponse.json({ error: wpJson?.message || "Invalid credentials" }, { status: wpRes.status });
    }

    const token = wpJson.token;
    if (!token) {
      return NextResponse.json({ error: "No token returned from WP" }, { status: 500 });
    }

    // Set cookie (httpOnly)
    const cookieOptions: any = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    };
    if (remember) {
      cookieOptions.maxAge = TOKEN_MAX_AGE;
    }
    const cookie = serialize(COOKIE_NAME, token, cookieOptions);

    const res = NextResponse.json({ 
      ok: true, 
      user: { 
        username: wpJson.user_display_name || wpJson.user_nicename || wpJson.user_email || null 
      } 
    });
    res.headers.set("Set-Cookie", cookie);
    return res;
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}