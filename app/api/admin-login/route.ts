import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    // Parse the incoming JSON request body
    const { password } = await request.json()

    // Check if the password is provided
    if (!password) {
      return NextResponse.json(
        { success: false, message: "Password is required" },
        { status: 400 }
      )
    }

    // Retrieve the admin password from environment variables
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

    // Check if the admin password is configured
    if (!ADMIN_PASSWORD) {
      return NextResponse.json(
        { success: false, message: "Server misconfiguration" },
        { status: 500 }
      )
    }

    // Compare the provided password with the admin password
    if (password === ADMIN_PASSWORD) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json(
        { success: false, message: "Invalid password" },
        { status: 401 }
      )
    }
  } catch (error) {
    // Handle any unexpected errors
    console.error("Admin login error:", error)
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    )
  }
}
