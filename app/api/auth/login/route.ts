import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()

    // Get valid passwords from environment variable
    const validPasswords = process.env.APP_PASSWORDS?.split(",").map((p) => p.trim()) || []

    // Check against configured passwords only
    if (validPasswords.length > 0 && validPasswords.includes(password)) {
      // Set authentication cookie
      const cookieStore = await cookies()
      cookieStore.set("auth_token", "authenticated", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ success: false }, { status: 401 })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Authentication failed" }, { status: 500 })
  }
}
