"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CalendarRange, Info } from "lucide-react"

export default function Step9() {
  const router = useRouter()
  const [totalWeeks, setTotalWeeks] = useState("")

  const handleNext = () => {
    // Save to localStorage for demo purposes
    const userProfile = JSON.parse(localStorage.getItem("userProfile") || "{}")
    localStorage.setItem(
      "userProfile",
      JSON.stringify({
        ...userProfile,
        timeFrame: totalWeeks,
      }),
    )
    router.push("/onboarding/step-10")
  }

  // Calculate the total number of steps (now 13 with the new steps)
  const totalSteps = 13
  const currentStep = 9
  const progressPercentage = (currentStep / totalSteps) * 100

  return (
    <Card className="w-full">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">Program Duration</CardTitle>
          <CalendarRange className="h-8 w-8 text-primary" />
        </div>
        <CardDescription>How many weeks do you plan to follow this training program?</CardDescription>
        <Progress value={progressPercentage} className="h-2" />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>
            Step {currentStep} of {totalSteps}
          </span>
          <span>Program Structure</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="totalWeeks">Total weeks to train</Label>
          <Input
            id="totalWeeks"
            type="number"
            placeholder="12"
            value={totalWeeks}
            onChange={(e) => setTotalWeeks(e.target.value)}
          />
        </div>

        <div className="rounded-lg border p-4 bg-muted/50">
          <div className="flex items-start space-x-3">
            <Info className="h-5 w-5 text-primary mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-sm font-medium">Program Duration</h4>
              <p className="text-xs text-muted-foreground">
                We recommend at least 8-12 weeks to see significant results. After your program ends, we'll help you
                reassess and create a new plan based on your progress.
              </p>
            </div>
          </div>
        </div>

        <div className="relative pt-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-background px-2 text-xs text-muted-foreground">Recommended Durations</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 py-2">
          <div className="flex flex-col items-center justify-center p-3 rounded-lg border bg-background">
            <span className="text-xs text-muted-foreground">Short Term</span>
            <span className="text-lg font-medium">4-8 weeks</span>
            <span className="text-xs text-muted-foreground mt-1">Quick results</span>
          </div>
          <div className="flex flex-col items-center justify-center p-3 rounded-lg border bg-background">
            <span className="text-xs text-muted-foreground">Standard</span>
            <span className="text-lg font-medium">8-12 weeks</span>
            <span className="text-xs text-muted-foreground mt-1">Optimal progress</span>
          </div>
          <div className="flex flex-col items-center justify-center p-3 rounded-lg border bg-background">
            <span className="text-xs text-muted-foreground">Long Term</span>
            <span className="text-lg font-medium">12+ weeks</span>
            <span className="text-xs text-muted-foreground mt-1">Significant changes</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => router.push("/onboarding/step-8")}>
          Back
        </Button>
        <Button onClick={handleNext} disabled={!totalWeeks}>
          Next
        </Button>
      </CardFooter>
    </Card>
  )
}
