import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Only allow access to the home page and essential static resources
  if (pathname !== "/") {
    // Redirect all other pages to home
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - video.mp4 (your video file)
     */
    "/((?!_next/static|_next/image|favicon.ico|video.mp4).*)",
  ],
}
