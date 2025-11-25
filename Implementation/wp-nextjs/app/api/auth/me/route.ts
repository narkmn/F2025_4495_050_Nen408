// /app/api/profile/route.ts
import { NextResponse } from "next/server";
import * as cookie from "cookie";

const WP_ME_URL = "https://healthacademy.ca/wp-json/wp/v2/users/me";
const COOKIE_NAME = "hc_token";

export async function GET(request: Request) {
  try {
    const cookieHeader = request.headers.get("cookie") || "";
    const cookies = cookie.parse(cookieHeader || "");
    const token = cookies[COOKIE_NAME];

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const wpRes = await fetch(WP_ME_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!wpRes.ok) {
      const body = await wpRes.text();
      return NextResponse.json({ error: "Failed to fetch user", detail: body }, { status: wpRes.status });
    }

    const userJson = await wpRes.json();
    return NextResponse.json({ ok: true, user: userJson });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
