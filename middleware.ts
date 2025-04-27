import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Allow access to specified paths without authentication
  if (
    pathname === "/" || 
    pathname === "/fpv-drone-iceland.mp4" || 
    pathname === "/admin" ||
    pathname === "/api/admin-login"
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
