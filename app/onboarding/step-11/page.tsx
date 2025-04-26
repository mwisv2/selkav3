"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Weight, Info } from "lucide-react"

export default function Step11() {
  const router = useRouter()
  const [maxes, setMaxes] = useState({
    squat: "",
    bench: "",
    deadlift: "",
    overhead: "",
  })

  const handleChange = (exercise: keyof typeof maxes, value: string) => {
    setMaxes((prev) => ({
      ...prev,
      [exercise]: value,
    }))
  }

  const handleNext = () => {
    // Save to localStorage for demo purposes
    const userProfile = JSON.parse(localStorage.getItem("userProfile") || "{}")
    localStorage.setItem(
      "userProfile",
      JSON.stringify({
        ...userProfile,
        maxes,
      }),
    )
    router.push("/onboarding/step-12")
  }

  // Calculate the total number of steps (now 14 with the new step)
  const totalSteps = 14
  const currentStep = 12
  const progressPercentage = (currentStep / totalSteps) * 100

  const isComplete = Object.values(maxes).some((value) => value !== "")

  return (
    <Card className="w-full">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">1-Rep Max (Optional)</CardTitle>
          <Weight className="h-8 w-8 text-primary" />
        </div>
        <CardDescription>Enter your 1-rep max for major lifts to help us calculate optimal weights</CardDescription>
        <Progress value={progressPercentage} className="h-2" />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>
            Step {currentStep} of {totalSteps}
          </span>
          <span>Strength Metrics</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-lg border p-4 bg-muted/50">
          <div className="flex items-start space-x-3">
            <Info className="h-5 w-5 text-primary mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-sm font-medium">What is 1-Rep Max?</h4>
              <p className="text-xs text-muted-foreground">
                Your 1-Rep Max (1RM) is the maximum weight you can lift for a single repetition of an exercise. This
                helps us calculate appropriate weights for your working sets.
              </p>
            </div>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          Enter your 1-rep max for compound lifts (in kg). Leave blank if unknown.
        </p>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="squat">Squat</Label>
            <Input
              id="squat"
              type="number"
              placeholder="100"
              value={maxes.squat}
              onChange={(e) => handleChange("squat", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bench">Bench Press</Label>
            <Input
              id="bench"
              type="number"
              placeholder="80"
              value={maxes.bench}
              onChange={(e) => handleChange("bench", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="deadlift">Deadlift</Label>
            <Input
              id="deadlift"
              type="number"
              placeholder="120"
              value={maxes.deadlift}
              onChange={(e) => handleChange("deadlift", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="overhead">Overhead Press</Label>
            <Input
              id="overhead"
              type="number"
              placeholder="60"
              value={maxes.overhead}
              onChange={(e) => handleChange("overhead", e.target.value)}
            />
          </div>
        </div>

        <div className="relative pt-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-background px-2 text-xs text-muted-foreground">Strength Standards</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 py-2">
          <div className="flex flex-col items-center justify-center p-3 rounded-lg border bg-background">
            <span className="text-xs text-muted-foreground">Beginner</span>
            <span className="text-sm font-medium">Squat: 0.8x BW</span>
            <span className="text-sm font-medium">Bench: 0.6x BW</span>
            <span className="text-sm font-medium">Deadlift: 1x BW</span>
          </div>
          <div className="flex flex-col items-center justify-center p-3 rounded-lg border bg-background">
            <span className="text-xs text-muted-foreground">Intermediate</span>
            <span className="text-sm font-medium">Squat: 1.5x BW</span>
            <span className="text-sm font-medium">Bench: 1x BW</span>
            <span className="text-sm font-medium">Deadlift: 1.75x BW</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => router.push("/onboarding/step-10b")}>
          Back
        </Button>
        <Button onClick={handleNext}>{isComplete ? "Next" : "Skip"}</Button>
      </CardFooter>
    </Card>
  )
}
