"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Calendar, Info } from "lucide-react"
import { syncUserData } from "@/lib/dataSync"

export default function Step3() {
  const router = useRouter()
  const [daysPerWeek, setDaysPerWeek] = useState<number | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  // Load saved data when component mounts
  useEffect(() => {
    try {
      const userProfile = JSON.parse(localStorage.getItem("userProfile") || "{}")
      if (userProfile.daysPerWeek) {
        setDaysPerWeek(Number.parseInt(userProfile.daysPerWeek))
      }
    } catch (error) {
      console.error("Error loading saved data:", error)
    }
  }, [])

  const handleNext = async () => {
    if (daysPerWeek === null) return

    setIsSaving(true)
    try {
      // Save to localStorage
      const userProfile = JSON.parse(localStorage.getItem("userProfile") || "{}")
      const updatedProfile = {
        ...userProfile,
        daysPerWeek,
      }

      localStorage.setItem("userProfile", JSON.stringify(updatedProfile))

      // Save to server
      await syncUserData({
        userProfile: updatedProfile,
        workoutData: JSON.parse(localStorage.getItem("workoutData") || "{}"),
      })

      // Mark step as completed
      const workoutData = JSON.parse(localStorage.getItem("workoutData") || "{}")
      const updatedWorkoutData = {
        ...workoutData,
        step3Completed: true,
      }
      localStorage.setItem("workoutData", JSON.stringify(updatedWorkoutData))

      // Update cookie
      document.cookie = `licenseData=${JSON.stringify({
        workoutData: updatedWorkoutData,
      })}; path=/; max-age=31536000`

      // If 4 days or less, go to step-3b to select specific days
      if (daysPerWeek <= 4) {
        router.push("/onboarding/step-3b")
      } else {
        router.push("/onboarding/step-4")
      }
    } catch (error) {
      console.error("Error saving data:", error)
    } finally {
      setIsSaving(false)
    }
  }

  // Calculate the total number of steps
  const totalSteps = 13
  const currentStep = 3
  const progressPercentage = (currentStep / totalSteps) * 100

  return (
    <Card className="w-full">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">Workout Frequency</CardTitle>
          <Calendar className="h-8 w-8 text-primary" />
        </div>
        <CardDescription>How many days per week would you like to work out?</CardDescription>
        <Progress value={progressPercentage} className="h-2" />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>
            Step {currentStep} of {totalSteps}
          </span>
          <span>Schedule</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          {[2, 3, 4, 5, 6, 7].map((days) => (
            <button
              key={days}
              className={`p-4 rounded-lg border text-center transition-all ${
                daysPerWeek === days
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border hover:border-primary/50"
              }`}
              onClick={() => setDaysPerWeek(days)}
            >
              <span className="text-lg font-medium">{days}</span>
              <span className="block text-xs text-muted-foreground mt-1">days</span>
            </button>
          ))}
        </div>

        <div className="rounded-lg border p-4 bg-muted/50">
          <div className="flex items-start space-x-3">
            <Info className="h-5 w-5 text-primary mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-sm font-medium">Recommendation</h4>
              <p className="text-xs text-muted-foreground">
                For beginners, we recommend 3-4 days per week with rest days in between. For intermediate or advanced
                fitness levels, 4-6 days may be appropriate.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => router.push("/onboarding/step-2")}>
          Back
        </Button>
        <Button onClick={handleNext} disabled={daysPerWeek === null || isSaving}>
          {isSaving ? (
            <>
              <span className="mr-2">Saving...</span>
              <div className="animate-spin h-4 w-4 border-2 border-background border-t-transparent rounded-full"></div>
            </>
          ) : (
            "Next"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
