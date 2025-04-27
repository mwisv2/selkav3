import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { password } = await request.json()

    if (!password) {
      console.error("No password provided")  // Debug log
      return NextResponse.json({ success: false, message: "Password is required" }, { status: 400 })
    }

    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

    if (!ADMIN_PASSWORD) {
      console.error("Server misconfiguration: Admin password not found in environment")  // Debug log
      return NextResponse.json({ success: false, message: "Server misconfiguration" }, { status: 500 })
    }

    console.log("Admin password from request:", password)  // Debug log
    console.log("Stored password from env:", ADMIN_PASSWORD)  // Debug log

    if (password === ADMIN_PASSWORD) {
      return NextResponse.json({ success: true })
    } else {
      console.error("Incorrect password entered")
      return NextResponse.json({ success: false, message: "Invalid password" }, { status: 401 })
    }
  } catch (error) {
    console.error("Admin login error:", error)
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
}
