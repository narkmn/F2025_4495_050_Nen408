import { NextResponse } from "next/server"
import { cookies } from "next/headers"

// In a real app, you would use an encryption library like bcrypt
// to hash and compare passwords
function validateCredentials(email: string, password: string) {
  // This is just for demo purposes - in a real app, you would check against a database
  return email === "user@example.com" && password === "password"
}

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 })
    }

    // In a real app, you would validate credentials against your database
    const isValid = validateCredentials(email, password)

    if (!isValid) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 })
    }

    // Create a mock user for demo purposes
    const user = {
      id: "1",
      name: "Demo User",
      email,
    }

    // In a real app, you would create a proper JWT token
    const token = "mock-jwt-token"

    // Set the session cookie
    cookies().set({
      name: "session",
      value: token,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    })

    return NextResponse.json({ user })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
