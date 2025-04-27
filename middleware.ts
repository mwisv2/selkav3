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
  
  // Check for admin authentication in browser storage
  // Note: This is a client-side check, we need to implement a server-side version
  // of this check by using a cookie instead
  const adminCookie = request.cookies.get("adminAuthenticated")
  
  // If the admin cookie is present, allow access to all parts of the site
  if (adminCookie && adminCookie.value === "true") {
    return NextResponse.next()
  }
  
  // Otherwise, redirect to home page
  return NextResponse.redirect(new URL("/", request.url))
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}