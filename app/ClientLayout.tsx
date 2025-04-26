"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { generateHWID } from "@/lib/hwid"
import { AutoSync } from "@/components/auto-sync"

function AuthCheck({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState(true)

  useEffect(() => {
    // Skip auth check for onboarding, home, and login pages
    if (pathname === "/" || pathname.startsWith("/onboarding") || pathname === "/login") {
      return
    }

    const checkAuth = async () => {
      const storedLicense = localStorage.getItem("licenseData")
      const storedHWID = localStorage.getItem("hwid")

      if (!storedLicense || !storedHWID) {
        setIsAuthenticated(false)
        return
      }

      try {
        const licenseData = JSON.parse(storedLicense)
        const currentHWID = await generateHWID()

        // Store the current HWID if it doesn't exist
        if (!storedHWID) {
          localStorage.setItem("hwid", currentHWID)
        }

        // Verify HWID matches
        if (currentHWID !== licenseData.hwid) {
          setIsAuthenticated(false)
          return
        }

        // Verify key with server
        const response = await fetch("/api/verifyKey", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            key: licenseData.key,
            hwid: currentHWID,
          }),
        })

        if (!response.ok) {
          setIsAuthenticated(false)
          return
        }

        setIsAuthenticated(true)
      } catch (error) {
        console.error("Auth check failed:", error)
        setIsAuthenticated(false)
      }
    }

    checkAuth()
  }, [pathname, router])

  return <>{children}</>
}

const inter = Inter({ subsets: ["latin"] })

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthCheck>{children}</AuthCheck>
          <AutoSync />
        </ThemeProvider>
      </body>
    </html>
  )
}
