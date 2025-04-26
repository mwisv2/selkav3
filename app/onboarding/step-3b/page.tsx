"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Calendar, Info, Check } from "lucide-react"
import { syncUserData } from "@/lib/dataSync"

export default function Step3b() {
  const router = useRouter()
  const [selectedDays, setSelectedDays] = useState<string[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [maxDays, setMaxDays] = useState(4)

  // Load saved data when component mounts
  useEffect(() => {
    try {
      const userProfile = JSON.parse(localStorage.getItem("userProfile") || "{}")

      // Set max days based on previous selection
      if (userProfile.daysPerWeek) {
        setMaxDays(Number.parseInt(userProfile.daysPerWeek))
      }

      // Load previously selected days if available
      if (userProfile.workoutDays && Array.isArray(userProfile.workoutDays)) {
        setSelectedDays(userProfile.workoutDays)
      }
    } catch (error) {
      console.error("Error loading saved data:", error)
    }
  }, [])

  const toggleDay = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day))
    } else {
      if (selectedDays.length < maxDays) {
        setSelectedDays([...selectedDays, day])
      }
    }
  }

  const handleNext = async () => {
    if (selectedDays.length === 0) return

    setIsSaving(true)
    try {
      // Save to localStorage
      const userProfile = JSON.parse(localStorage.getItem("userProfile") || "{}")
      const updatedProfile = {
        ...userProfile,
        workoutDays: selectedDays,
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
        step3bCompleted: true,
      }
      localStorage.setItem("workoutData", JSON.stringify(updatedWorkoutData))

      // Update cookie
      document.cookie = `licenseData=${JSON.stringify({
        workoutData: updatedWorkoutData,
      })}; path=/; max-age=31536000`

      router.push("/onboarding/step-4")
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

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

  return (
    <Card className="w-full">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">Select Workout Days</CardTitle>
          <Calendar className="h-8 w-8 text-primary" />
        </div>
        <CardDescription>Choose which days of the week you want to work out</CardDescription>
        <Progress value={progressPercentage} className="h-2" />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>
            Step {currentStep} of {totalSteps}
          </span>
          <span>Schedule</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-3">
          {days.map((day) => (
            <button
              key={day}
              className={`p-4 rounded-lg border flex items-center justify-between transition-all ${
                selectedDays.includes(day)
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border hover:border-primary/50"
              }`}
              onClick={() => toggleDay(day)}
              disabled={!selectedDays.includes(day) && selectedDays.length >= maxDays}
            >
              <span className="text-md font-medium">{day}</span>
              {selectedDays.includes(day) && <Check className="h-5 w-5" />}
            </button>
          ))}
        </div>

        <div className="rounded-lg border p-4 bg-muted/50">
          <div className="flex items-start space-x-3">
            <Info className="h-5 w-5 text-primary mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-sm font-medium">Select up to {maxDays} days</h4>
              <p className="text-xs text-muted-foreground">
                Based on your previous selection, you can choose up to {maxDays} days per week for your workouts. We
                recommend spacing your workout days throughout the week for optimal recovery.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => router.push("/onboarding/step-3")}>
          Back
        </Button>
        <Button onClick={handleNext} disabled={selectedDays.length === 0 || isSaving}>
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
