"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { generateHWID, getStoredHWID, storeHWID } from "@/lib/hwid"
import { toast } from "sonner"

export default function Step1Page() {
  const [key, setKey] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  // Replace the handleSubmit function with this updated version:
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Get or generate HWID
      let hwid = await getStoredHWID()
      if (!hwid) {
        hwid = await generateHWID()
        await storeHWID(hwid)
      }

      // First, try to activate the key with the signup endpoint
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ key }),
      })

      // Check if response is ok before trying to parse JSON
      if (!response.ok) {
        const errorText = await response.text()
        console.error("API Error Response:", errorText)
        throw new Error(`Server error: ${response.status} ${response.statusText}`)
      }

      // Parse JSON response
      let data
      try {
        data = await response.json()
      } catch (jsonError) {
        console.error("JSON Parse Error:", jsonError)
        throw new Error("Invalid response from server")
      }

      // Check for success flag in response
      if (!data.success) {
        throw new Error(data.message || "Key activation failed")
      }

      // Store license data
      const licenseData = {
        key,
        hwid: data.data.hwid,
        isActive: true,
        lastUpdated: new Date().toISOString(),
      }

      // Set license data in localStorage
      localStorage.setItem("licenseData", JSON.stringify(licenseData))

      // Mark step 1 as completed
      localStorage.setItem("step1Completed", "true")

      // Set authentication cookie
      document.cookie = `selkaUserAuthenticated=true; path=/; max-age=${60 * 60 * 24 * 30}` // 30 days
      document.cookie = `licenseData=${JSON.stringify({
        key,
        hwid: data.data.hwid,
        isActive: true,
        workoutData: data.data.workoutData,
      })}; path=/; max-age=${60 * 60 * 24 * 30}` // 30 days

      // Load initial data from the server response
      if (data.data.workoutData) {
        Object.entries(data.data.workoutData).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            localStorage.setItem(key, typeof value === "object" ? JSON.stringify(value) : String(value))
          }
        })
      }

      // Show success message
      toast.success("Access key activated successfully!")

      // Redirect to step-2
      router.push("/onboarding/step-2")
    } catch (err) {
      console.error("Error:", err)
      setError(err instanceof Error ? err.message : "Failed to activate key")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container max-w-lg mx-auto p-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Enter Access Key</h1>
          <p className="text-muted-foreground">
            Please enter your access key to continue. This key will be locked to your device.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Enter your access key"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              required
              disabled={isLoading}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Verifying..." : "Continue"}
          </Button>
        </form>
      </div>
    </div>
  )
}
