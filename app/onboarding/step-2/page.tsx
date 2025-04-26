"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Ruler, Info } from "lucide-react"
import { syncUserData } from "@/lib/dataSync"

export default function Step2() {
  const router = useRouter()
  const [height, setHeight] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  // Load saved height when component mounts
  useEffect(() => {
    try {
      const userProfile = JSON.parse(localStorage.getItem("userProfile") || "{}")
      if (userProfile.height) {
        setHeight(userProfile.height)
      }
    } catch (error) {
      console.error("Error loading saved height:", error)
    }
  }, [])

  const handleNext = async () => {
    setIsSaving(true)
    try {
      // Save to localStorage for demo purposes
      const userProfile = JSON.parse(localStorage.getItem("userProfile") || "{}")
      const updatedProfile = {
        ...userProfile,
        height,
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
        step2Completed: true,
      }
      localStorage.setItem("workoutData", JSON.stringify(updatedWorkoutData))

      // Update cookie
      document.cookie = `licenseData=${JSON.stringify({
        workoutData: updatedWorkoutData,
      })}; path=/; max-age=31536000`

      router.push("/onboarding/step-3")
    } catch (error) {
      console.error("Error saving height:", error)
    } finally {
      setIsSaving(false)
    }
  }

  // Calculate the total number of steps (now 13 with the new steps)
  const totalSteps = 13
  const currentStep = 2
  const progressPercentage = (currentStep / totalSteps) * 100

  return (
    <Card className="w-full">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">Your Height</CardTitle>
          <Ruler className="h-8 w-8 text-primary" />
        </div>
        <CardDescription>We'll use your height to calculate appropriate workout recommendations</CardDescription>
        <Progress value={progressPercentage} className="h-2" />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>
            Step {currentStep} of {totalSteps}
          </span>
          <span>Basic Info</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="height">Height (cm)</Label>
          <Input
            id="height"
            type="number"
            placeholder="175"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
          />
        </div>

        <div className="rounded-lg border p-4 bg-muted/50">
          <div className="flex items-start space-x-3">
            <Info className="h-5 w-5 text-primary mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-sm font-medium">Why we need this</h4>
              <p className="text-xs text-muted-foreground">
                Your height helps us calculate your body mass index (BMI) and determine appropriate exercise intensity.
                This information is stored locally on your device.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 py-2">
          <div className="flex flex-col items-center justify-center p-3 rounded-lg border bg-background">
            <span className="text-xs text-muted-foreground">Short</span>
            <span className="text-lg font-medium">150-165cm</span>
          </div>
          <div className="flex flex-col items-center justify-center p-3 rounded-lg border bg-background">
            <span className="text-xs text-muted-foreground">Average</span>
            <span className="text-lg font-medium">165-180cm</span>
          </div>
          <div className="flex flex-col items-center justify-center p-3 rounded-lg border bg-background">
            <span className="text-xs text-muted-foreground">Tall</span>
            <span className="text-lg font-medium">180-195cm</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => router.push("/onboarding/step-1")}>
          Back
        </Button>
        <Button onClick={handleNext} disabled={!height || isSaving}>
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
