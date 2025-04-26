"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Clock, Info } from "lucide-react"

export default function Step6() {
  const router = useRouter()
  const [timePerDay, setTimePerDay] = useState("")

  const handleNext = () => {
    // Save to localStorage for demo purposes
    const userProfile = JSON.parse(localStorage.getItem("userProfile") || "{}")
    localStorage.setItem(
      "userProfile",
      JSON.stringify({
        ...userProfile,
        minsPerDay: timePerDay,
      }),
    )
    router.push("/onboarding/step-7")
  }

  // Calculate the total number of steps (now 13 with the new steps)
  const totalSteps = 13
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
        <Button onClick={handleNext} disabled={!timePerDay}>
          Next
        </Button>
      </CardFooter>
    </Card>
  )
}
