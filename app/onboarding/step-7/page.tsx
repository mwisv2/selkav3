"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { CalendarDays, Info } from "lucide-react"

export default function Step7() {
  const router = useRouter()
  const [daysPerWeek, setDaysPerWeek] = useState("")

  const handleNext = () => {
    // Save to localStorage for demo purposes
    const userProfile = JSON.parse(localStorage.getItem("userProfile") || "{}")
    localStorage.setItem(
      "userProfile",
      JSON.stringify({
        ...userProfile,
        daysPerWeek,
      }),
    )
    router.push("/onboarding/step-8")
  }

  // Calculate the total number of steps (now 13 with the new steps)
  const totalSteps = 13
  const currentStep = 7
  const progressPercentage = (currentStep / totalSteps) * 100

  return (
    <Card className="w-full">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">Days Per Week</CardTitle>
          <CalendarDays className="h-8 w-8 text-primary" />
        </div>
        <CardDescription>How many days per week can you commit to training?</CardDescription>
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
          <Label htmlFor="daysPerWeek">Training days per week</Label>
          <Select value={daysPerWeek} onValueChange={setDaysPerWeek}>
            <SelectTrigger id="daysPerWeek">
              <SelectValue placeholder="Select days" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                <SelectItem key={day} value={day.toString()}>
                  {day} {day === 1 ? "day" : "days"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-lg border p-4 bg-muted/50">
          <div className="flex items-start space-x-3">
            <Info className="h-5 w-5 text-primary mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-sm font-medium">Training Frequency</h4>
              <p className="text-xs text-muted-foreground">
                Consistency is key! We'll design a workout split that matches your availability while ensuring proper
                recovery.
              </p>
            </div>
          </div>
        </div>

        <div className="relative pt-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-background px-2 text-xs text-muted-foreground">Recommended Splits</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 py-2">
          <div className="flex flex-col items-center justify-center p-3 rounded-lg border bg-background">
            <span className="text-xs text-muted-foreground">Beginner</span>
            <span className="text-lg font-medium">2-3 days</span>
            <span className="text-xs text-muted-foreground mt-1">Full body</span>
          </div>
          <div className="flex flex-col items-center justify-center p-3 rounded-lg border bg-background">
            <span className="text-xs text-muted-foreground">Intermediate</span>
            <span className="text-lg font-medium">3-4 days</span>
            <span className="text-xs text-muted-foreground mt-1">Upper/Lower</span>
          </div>
          <div className="flex flex-col items-center justify-center p-3 rounded-lg border bg-background">
            <span className="text-xs text-muted-foreground">Advanced</span>
            <span className="text-lg font-medium">5-6 days</span>
            <span className="text-xs text-muted-foreground mt-1">Body part split</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => router.push("/onboarding/step-6")}>
          Back
        </Button>
        <Button onClick={handleNext} disabled={!daysPerWeek}>
          Next
        </Button>
      </CardFooter>
    </Card>
  )
}
