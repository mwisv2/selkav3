// middleware.ts
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 1) Always allow Next.js internals & your static files
  if (
    pathname.startsWith("/_next/") ||      // next-internal JS/CSS/images
    pathname.startsWith("/api/")   ||      // your API routes
    pathname.match(/\.[^\/]+$/)             // any “.ext” at end (jpg, mp4, css…)
  ) {
    return NextResponse.next()
  }

  // 2) Only your homepage is guarded
  if (pathname !== "/") {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

// apply to every path
export const config = {
  matcher: "/:path*",
}
