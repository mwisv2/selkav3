"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"
import { syncUserData } from "@/lib/dataSync"

export default function OnboardingComplete() {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(true)

  useEffect(() => {
    const completeOnboarding = async () => {
      try {
        // Get existing data
        const userProfile = JSON.parse(localStorage.getItem("userProfile") || "{}")
        const workoutData = JSON.parse(localStorage.getItem("workoutData") || "{}")

        // Mark onboarding as completed
        const updatedWorkoutData = {
          ...workoutData,
          onboardingCompleted: true,
        }

        // Save to localStorage
        localStorage.setItem("workoutData", JSON.stringify(updatedWorkoutData))

        // Save to server
        await syncUserData({
          userProfile,
          workoutData: updatedWorkoutData,
        })

        // Update cookie
        document.cookie = `licenseData=${JSON.stringify({
          workoutData: updatedWorkoutData,
        })}; path=/; max-age=31536000`

        setIsSaving(false)
      } catch (error) {
        console.error("Error completing onboarding:", error)
        setIsSaving(false)
      }
    }

    completeOnboarding()
  }, [])

  const handleContinue = () => {
    router.push("/dashboard")
  }

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1 flex flex-col items-center text-center pb-2">
        <CheckCircle className="h-16 w-16 text-primary mb-2" />
        <CardTitle className="text-2xl">Setup Complete!</CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4 pt-4">
        <p>Congratulations! You've completed the setup process for your personalized workout plan.</p>
        <p>
          Your profile has been created and your workout plan is ready. You can now start tracking your fitness journey.
        </p>
        {isSaving && (
          <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
            <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
            <span>Saving your data...</span>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handleContinue} disabled={isSaving}>
          Continue to Dashboard
        </Button>
      </CardFooter>
    </Card>
  )
}
