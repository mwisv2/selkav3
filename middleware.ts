import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Allow access to specified paths including video formats
  if (
    pathname === "/" || 
    pathname === "/admin" || 
    pathname === "/api/admin-login" ||
    pathname.endsWith(".mp4") || // Allow .mp4 files
    pathname.endsWith(".ogg") || // Allow .ogg files
    pathname.endsWith(".webm") // Allow .webm files (optional, if you want to support this format)
  ) {
    return NextResponse.next()
  }

  // Check for admin authentication in cookies
  const adminCookie = request.cookies.get("adminAuthenticated")
  
  // If the admin cookie is present and set to "true", allow access to the site
  if (adminCookie && adminCookie.value === "true") {
    return NextResponse.next()
  }

  // Redirect to the login page if not authenticated
  return NextResponse.redirect(new URL("/admin", request.url))
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}
