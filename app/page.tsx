'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { motion } from "framer-motion"
import { LockIcon } from "lucide-react"
import Link from "next/link"

export default function Home() {
  const router = useRouter()
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    // Set loaded state for animations
    setLoaded(true)
  }, [])

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="relative w-full h-full overflow-hidden">
          {/* YouTube iframe with enhanced settings and improved styling */}
          <div className="absolute w-full h-full scale-125">
            <iframe
              className="absolute w-full h-full object-cover"
              style={{
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none'
              }}
              src="https://www.youtube.com/embed/kcfs1-ryKWE?autoplay=1&mute=1&loop=1&playlist=kcfs1-ryKWE&controls=0&modestbranding=1&rel=0&fs=0&iv_load_policy=3&showinfo=0&disablekb=1"
              title="FPV Drone Iceland"
              frameBorder="0"
              allow="autoplay; fullscreen"
              allowFullScreen
            />
          </div>
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
          <p className="text-xl text-gray-300 mb-2">Your AI powered fitness journey</p>
          
          {/* Lock status message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={loaded ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex items-center justify-center gap-2 mb-6 bg-red-900/30 py-2 px-4 rounded-md border border-red-500/50"
          >
            <LockIcon size={18} className="text-red-400" />
            <p className="text-red-200 font-medium">Site access is currently locked</p>
          </motion.div>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={loaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Button
                size="lg"
                className="w-full sm:w-auto min-w-[120px] bg-gray-700/50 cursor-not-allowed opacity-50 hover:bg-gray-700/50"
                disabled
              >
                <LockIcon size={16} className="mr-2" />
                Login
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={loaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto min-w-[120px] border-gray-600 text-gray-400 cursor-not-allowed opacity-50 hover:bg-transparent"
                disabled
              >
                <LockIcon size={16} className="mr-2" />
                Sign Up
              </Button>
            </motion.div>
          </div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={loaded ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-gray-400 max-w-md mx-auto text-sm"
          >
            Access to Selka is temporarily restricted. The platform will be available soon. For <Link href="https://selka-info.vercel.app" className="text-blue-400 hover:underline">info on Selka</Link>, visit our information site.
          </motion.div>
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