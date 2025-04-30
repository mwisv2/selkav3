"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Clock, Info } from "lucide-react"
import { syncUserData } from "@/lib/dataSync"

export default function Step6() {
  const router = useRouter()
  const [timePerDay, setTimePerDay] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  // Load saved data when component mounts
  useEffect(() => {
    try {
      const userProfile = JSON.parse(localStorage.getItem("userProfile") || "{}")
      if (userProfile.minsPerDay) {
        setTimePerDay(userProfile.minsPerDay.toString())
      }
    } catch (error) {
      console.error("Error loading saved data:", error)
    }
  }, [])

  const handleNext = async () => {
    if (!timePerDay) return

    setIsSaving(true)
    try {
      // Save to localStorage
      const userProfile = JSON.parse(localStorage.getItem("userProfile") || "{}")
      const updatedProfile = {
        ...userProfile,
        minsPerDay: timePerDay,
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
        step6Completed: true,
        // Also mark step7 as completed to skip it
        step7Completed: true,
      }
      localStorage.setItem("workoutData", JSON.stringify(updatedWorkoutData))

      // Update cookie
      document.cookie = `licenseData=${JSON.stringify({
        workoutData: updatedWorkoutData,
      })}; path=/; max-age=31536000`

      // Skip step-7 and go directly to step-8
      router.push("/onboarding/step-7")
    } catch (error) {
      console.error("Error saving data:", error)
    } finally {
      setIsSaving(false)
    }
  }

  // Calculate the total number of steps (now 12 with step-7 removed)
  const totalSteps = 12
  const currentStep = 6
  const progressPercentage = (currentStep / totalSteps) * 100

  return (
    <Card className="w-full">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">Time Available</CardTitle>
          <Clock className="h-8 w-8 text-primary" />
        </div>
        <CardDescription>How much time can you dedicate to each workout session?</CardDescription>
        <Progress value={progressPercentage} className="h-2" />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>
            Step {currentStep} of {totalSteps}
          </span>
          <span>Schedule</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="timePerDay">Minutes available per day</Label>
          <Input
            id="timePerDay"
            type="number"
            placeholder="60"
            value={timePerDay}
            onChange={(e) => setTimePerDay(e.target.value)}
          />
        </div>

        <div className="rounded-lg border p-4 bg-muted/50">
          <div className="flex items-start space-x-3">
            <Info className="h-5 w-5 text-primary mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-sm font-medium">Workout Duration</h4>
              <p className="text-xs text-muted-foreground">
                Even short workouts can be effective! We'll optimize your routine based on the time you have available.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 py-2">
          <div className="flex flex-col items-center justify-center p-3 rounded-lg border bg-background">
            <span className="text-xs text-muted-foreground">Quick</span>
            <span className="text-lg font-medium">15-30 min</span>
            <span className="text-xs text-muted-foreground mt-1">High intensity</span>
          </div>
          <div className="flex flex-col items-center justify-center p-3 rounded-lg border bg-background">
            <span className="text-xs text-muted-foreground">Standard</span>
            <span className="text-lg font-medium">30-60 min</span>
            <span className="text-xs text-muted-foreground mt-1">Balanced</span>
          </div>
          <div className="flex flex-col items-center justify-center p-3 rounded-lg border bg-background">
            <span className="text-xs text-muted-foreground">Extended</span>
            <span className="text-lg font-medium">60+ min</span>
            <span className="text-xs text-muted-foreground mt-1">Comprehensive</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => router.push("/onboarding/step-5")}>
          Back
        </Button>
        <Button onClick={handleNext} disabled={!timePerDay || isSaving}>
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
