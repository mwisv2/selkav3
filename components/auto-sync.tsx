"use client"

import { useEffect, useState } from "react"
import { syncUserData } from "@/lib/dataSync"
import { generateWorkouts } from "@/components/generate-workouts"

export function AutoSync() {
  const [lastSync, setLastSync] = useState<string | null>(null)

  useEffect(() => {
    // Load last sync time
    const storedLastSync = localStorage.getItem("lastDataSync")
    if (storedLastSync) {
      setLastSync(storedLastSync)
    }

    // Function to perform sync
    const performSync = async () => {
      // Check if we have the necessary data before attempting to sync
      const licenseData = localStorage.getItem("licenseData")
      if (!licenseData) {
        console.log("Skipping sync - no license data available")
        return
      }

      // Ensure generatedWorkouts exists before syncing
      if (!localStorage.getItem("generatedWorkouts")) {
        const userProfile = JSON.parse(localStorage.getItem("userProfile") || "null")
        if (userProfile) {
          try {
            const workouts = generateWorkouts(userProfile)
            localStorage.setItem("generatedWorkouts", JSON.stringify(workouts))
          } catch (error) {
            console.error("Error generating workouts before sync:", error)
            localStorage.setItem("generatedWorkouts", "[]")
          }
        } else {
          localStorage.setItem("generatedWorkouts", "[]")
        }
      }

      try {
        const success = await syncUserData()
        if (success) {
          const newLastSync = localStorage.getItem("lastDataSync")
          setLastSync(newLastSync)
        }
      } catch (error) {
        console.error("Error in auto sync:", error)
      }
    }

    // Initial sync on component mount - with a slight delay to ensure other data is loaded
    const initialSyncTimeout = setTimeout(() => {
      performSync()
    }, 2000)

    // Set up interval for periodic syncing (every 5 minutes)
    const syncInterval = setInterval(performSync, 5 * 60 * 1000)

    // Set up event listeners for page visibility changes
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        performSync()
      }
    }

    // Set up event listener for before unload to sync before leaving
    const handleBeforeUnload = () => {
      // Only sync if we have license data
      const licenseData = localStorage.getItem("licenseData")
      if (licenseData) {
        syncUserData().catch((error) => {
          console.error("Error syncing data before unload:", error)
        })
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    window.addEventListener("beforeunload", handleBeforeUnload)

    return () => {
      clearTimeout(initialSyncTimeout)
      clearInterval(syncInterval)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [])

  return null // This component doesn't render anything
}
