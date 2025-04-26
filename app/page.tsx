"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { generateHWID } from "@/lib/hwid"
import { motion } from "framer-motion"

export default function Home() {
  const router = useRouter()
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    // Set loaded state for animations
    setLoaded(true)

    const checkAuth = async () => {
      // Check if user is already authenticated
      const isAuthenticated = document.cookie.includes("selkaUserAuthenticated=true")
      const licenseData = localStorage.getItem("selkaLicense")

      if (isAuthenticated && licenseData) {
        try {
          // Verify HWID matches current device
          const parsedLicense = JSON.parse(licenseData)
          const currentHWID = await generateHWID()

          if (parsedLicense.hwid === currentHWID) {
            // HWID matches, redirect to dashboard
            router.push("/dashboard")
          }
        } catch (e) {
          console.error("Error parsing license data", e)
        }
      }
    }

    checkAuth()
  }, [router])

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Video Background using iframe for YouTube */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="relative w-full h-full">
          <iframe
            src="https://www.youtube.com/embed/kcfs1-ryKWE?autoplay=1&controls=0&showinfo=0&rel=0&loop=1&mute=1&playlist=kcfs1-ryKWE&enablejsapi=1"
            className="absolute w-[300%] h-[300%] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="FPV Drone Flight through Beautiful Iceland Canyon"
          ></iframe>
        </div>
        <div className="absolute inset-0 bg-black/70 z-10" />
      </div>

      {/* Content */}
      <div className="z-20 max-w-5xl w-full flex flex-col items-center justify-center px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={loaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center"
        >
          <h1 className="text-5xl sm:text-6xl font-bold mb-4 text-white">Selka</h1>
          <p className="text-xl text-gray-300 mb-8">Your AI-powered fitness journey</p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={loaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Link href="/login">
                <Button
                  size="lg"
                  className="w-full sm:w-auto min-w-[120px] bg-primary hover:bg-primary/90 transition-all"
                >
                  Login
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={loaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Link href="/onboarding/step-1">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto min-w-[120px] border-white text-white hover:bg-white/10 transition-all"
                >
                  Sign Up
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={loaded ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="absolute bottom-8 right-8"
        >
          <ThemeToggle />
        </motion.div>
      </div>
    </div>
  )
}
