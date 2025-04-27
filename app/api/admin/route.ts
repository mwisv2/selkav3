import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const { password } = await request.json()

  // Compare with your secret password from environment variables
  if (password === process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ success: true })
  } else {
    return NextResponse.json({ success: false, message: "Invalid password" }, { status: 401 })
  }
}
