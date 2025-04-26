"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Repeat, Info } from "lucide-react"

export default function Step8() {
  const router = useRouter()
  const [cycle, setCycle] = useState("")

  const handleNext = () => {
    // Save to localStorage for demo purposes
    const userProfile = JSON.parse(localStorage.getItem("userProfile") || "{}")
    localStorage.setItem(
      "userProfile",
      JSON.stringify({
        ...userProfile,
        cycleLength: cycle,
      }),
    )
    router.push("/onboarding/step-9")
  }

  // Calculate the total number of steps (now 13 with the new steps)
  const totalSteps = 13
  const currentStep = 8
  const progressPercentage = (currentStep / totalSteps) * 100

  return (
    <Card className="w-full">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">Cycle Length</CardTitle>
          <Repeat className="h-8 w-8 text-primary" />
        </div>
        <CardDescription>Choose how long each training cycle should be</CardDescription>
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
          <Label>How long should each training cycle be?</Label>
          <RadioGroup value={cycle} onValueChange={setCycle} className="space-y-3">
            <div
              className={`flex items-center space-x-2 rounded-lg border p-4 transition-colors ${
                cycle === "1-week" ? "border-primary bg-primary/5" : "hover:bg-muted/50"
              }`}
            >
              <RadioGroupItem value="1-week" id="1-week" className="mt-0.5" />
              <div className="flex flex-1 items-center justify-between">
                <Label htmlFor="1-week" className="flex items-center cursor-pointer">
                  <div>
                    <span className="font-medium">1-week cycle</span>
                    <p className="text-xs text-muted-foreground mt-1">
                      Repeat the same workouts each week. Good for beginners and consistency.
                    </p>
                  </div>
                </Label>
              </div>
            </div>

            <div
              className={`flex items-center space-x-2 rounded-lg border p-4 transition-colors ${
                cycle === "2-week" ? "border-primary bg-primary/5" : "hover:bg-muted/50"
              }`}
            >
              <RadioGroupItem value="2-week" id="2-week" className="mt-0.5" />
              <div className="flex flex-1 items-center justify-between">
                <Label htmlFor="2-week" className="flex items-center cursor-pointer">
                  <div>
                    <span className="font-medium">2-week cycle</span>
                    <p className="text-xs text-muted-foreground mt-1">
                      Alternate between two different workout weeks. Better for variety and progression.
                    </p>
                  </div>
                </Label>
              </div>
            </div>
          </RadioGroup>
        </div>

        <div className="rounded-lg border p-4 bg-muted/50">
          <div className="flex items-start space-x-3">
            <Info className="h-5 w-5 text-primary mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-sm font-medium">Training Cycles</h4>
              <p className="text-xs text-muted-foreground">
                Training cycles help prevent plateaus and keep your workouts fresh. Longer cycles allow for more
                exercise variety and progressive overload strategies.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 py-2">
          <div className="flex flex-col items-center justify-center p-3 rounded-lg border bg-background">
            <span className="text-xs text-muted-foreground">1-Week Cycle</span>
            <div className="flex space-x-1 my-2">
              {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                <div key={day} className="w-4 h-4 rounded-full bg-primary/20"></div>
              ))}
            </div>
            <span className="text-xs text-muted-foreground mt-1">Repeat weekly</span>
          </div>
          <div className="flex flex-col items-center justify-center p-3 rounded-lg border bg-background">
            <span className="text-xs text-muted-foreground">2-Week Cycle</span>
            <div className="flex space-x-1 my-2">
              {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                <div key={`week1-${day}`} className="w-4 h-4 rounded-full bg-primary/20"></div>
              ))}
            </div>
            <div className="flex space-x-1 mb-2">
              {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                <div key={`week2-${day}`} className="w-4 h-4 rounded-full bg-primary/40"></div>
              ))}
            </div>
            <span className="text-xs text-muted-foreground mt-1">Alternate weeks</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => router.push("/onboarding/step-7")}>
          Back
        </Button>
        <Button onClick={handleNext} disabled={!cycle}>
          Next
        </Button>
      </CardFooter>
    </Card>
  )
}
