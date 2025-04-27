import { NextResponse } from "next/server"

// Make sure to export both the method and handler
export async function POST(request: Request) {
  try {
    const { password } = await request.json()

    if (!password) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Password is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      )
    }

    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

    if (!ADMIN_PASSWORD) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Server misconfiguration" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      )
    }

    if (password === ADMIN_PASSWORD) {
      return new NextResponse(
        JSON.stringify({ success: true }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      )
    } else {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Invalid password" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      )
    }
  } catch (error) {
    console.error("Error in authentication:", error)

    return new NextResponse(
      JSON.stringify({ success: false, message: "Server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }
}
