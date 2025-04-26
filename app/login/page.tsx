"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { generateHWID, storeHWID } from "@/lib/hwid"
import { loadUserDataFromServer } from "@/lib/dataSync"
import { toast } from "sonner"

export default function LoginPage() {
  const [key, setKey] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Generate and store HWID
      const hwid = await generateHWID()
      await storeHWID(hwid)

      // Verify key and HWID
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          key,
        }),
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
        throw new Error(data.message || "Login failed")
      }

      // Store license data
      const licenseData = {
        key,
        hwid: data.data.hwid,
        isActive: true,
        lastUpdated: new Date().toISOString(),
      }

      // Clear all existing data from localStorage
      localStorage.clear()

      // Set license data in localStorage
      localStorage.setItem("licenseData", JSON.stringify(licenseData))

      // Load all user data from server response
      loadUserDataFromServer(data.data)

      // Set authentication cookie
      document.cookie = `selkaUserAuthenticated=true; path=/; max-age=${60 * 60 * 24 * 30}` // 30 days
      document.cookie = `licenseData=${JSON.stringify(licenseData)}; path=/; max-age=${60 * 60 * 24 * 30}` // 30 days

      // Show success message
      toast.success("Login successful!")

      // Determine where to redirect based on the current step
      const currentStep = data.data.currentStep || "step-1"
      router.push(`/onboarding/${currentStep}`)
    } catch (err) {
      console.error("Login error:", err)
      setError(err instanceof Error ? err.message : "Failed to login. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container max-w-lg mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Enter your access key to continue</CardDescription>
        </CardHeader>
        <CardContent>
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
              {isLoading ? "Verifying..." : "Login"}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              <p>Don't have an account? Use the signup option below.</p>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => router.push("/onboarding/step-1")}
              disabled={isLoading}
            >
              Sign Up
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
