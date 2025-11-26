import { NextResponse } from "next/server";

// const WP_SIGNUP_URL = "https://healthacademy.ca/wp-json/wp/v2/users/register";
const WP_SIGNUP_URL = "https://healthacademy.ca//wp-json/custom/v1/register";


export async function POST(req: Request) {
  try {
    const { username, email, password } = await req.json();

    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // WordPress user creation endpoint
    const wpRes = await fetch(WP_SIGNUP_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        email,
        password,
      }),
    });

    const data = await wpRes.json();

    if (!wpRes.ok) {
      return NextResponse.json(
        { error: data?.message || "Signup failed" },
        { status: wpRes.status }
      );
    }

    // If successful → return success + optional auto login trigger
    return NextResponse.json({
      ok: true,
      message: "Account created successfully.",
      redirect: "/login", // optional, client can use it
    });

  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
