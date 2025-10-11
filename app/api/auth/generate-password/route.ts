import { NextResponse } from "next/server"

// Generate a random password with specified length
function generateRandomPassword(length = 16): string {
  const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*"
  let password = ""

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length)
    password += charset[randomIndex]
  }

  return password
}

export async function GET() {
  try {
    // Generate 5 random passwords
    const passwords = Array.from({ length: 5 }, () => generateRandomPassword(16))

    return NextResponse.json({
      passwords,
      instructions: "Add these passwords to your APP_PASSWORDS environment variable, separated by commas.",
      example: `APP_PASSWORDS=${passwords.join(",")}`,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to generate passwords" }, { status: 500 })
  }
}
