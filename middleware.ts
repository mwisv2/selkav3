import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Public paths that are always accessible without authentication
  const publicPaths = ["/", "/login", "/onboarding/step-1"]

  // API routes that should be accessible
  const apiPaths = ["/api/verifyKey", "/api/saveWorkoutData", "/api/signup", "/api/login", "/api/syncUserData"]

  // Check if the current path is a public path or API path
  if (publicPaths.includes(pathname) || apiPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // Check authentication
  const isAuthenticated = request.cookies.has("selkaUserAuthenticated")

  // If not authenticated, redirect to login except for step-1
  if (!isAuthenticated && pathname !== "/onboarding/step-1") {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Get license data if authenticated
  const licenseData = request.cookies.get("licenseData")?.value
  const parsedLicenseData = licenseData ? JSON.parse(licenseData) : null
  const isOnboardingCompleted = parsedLicenseData?.workoutData?.onboardingCompleted === true

  // If authenticated but onboarding not completed
  if (isAuthenticated && !isOnboardingCompleted) {
    // Allow access to all onboarding steps and API routes
    const isOnboardingStep = /^\/onboarding\/(?:step-(?:[1-9]|3b|10b?|1[1-3])|complete)$/.test(pathname)
    const isApiRoute = pathname.startsWith("/api/")

    // If trying to access dashboard or other protected pages, redirect to appropriate onboarding step
    if (!isOnboardingStep && !isApiRoute && !pathname.startsWith("/onboarding/")) {
      // Redirect to step-2 as a fallback
      return NextResponse.redirect(new URL("/onboarding/step-2", request.url))
    }
  }
  // If onboarding is completed
  else if (isAuthenticated && isOnboardingCompleted) {
    // Block access to onboarding steps (except complete page)
    const isOnboardingStep = /^\/onboarding\/step-(?:[1-9]|3b|10b?|1[1-3])$/.test(pathname)
    if (isOnboardingStep) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
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
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}
