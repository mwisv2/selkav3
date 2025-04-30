"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Weight, Info } from "lucide-react"

export default function Step3() {
  const router = useRouter()
  const [weight, setWeight] = useState("")

  const handleNext = () => {
    // Save to localStorage for demo purposes
    const userProfile = JSON.parse(localStorage.getItem("userProfile") || "{}")
    localStorage.setItem(
      "userProfile",
      JSON.stringify({
        ...userProfile,
        weight,
      }),
    )
    router.push("/onboarding/step-8")
  }

  // Calculate the total number of steps (now 13 with the new steps)
  const totalSteps = 13
  const currentStep = 3
  const progressPercentage = (currentStep / totalSteps) * 100

  return (
    <Card className="w-full">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">Your Weight</CardTitle>
          <Weight className="h-8 w-8 text-primary" />
        </div>
        <CardDescription>Your current weight helps us tailor workouts to your specific needs</CardDescription>
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
          <Label htmlFor="weight">Weight (kg)</Label>
          <Input
            id="weight"
            type="number"
            placeholder="70"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
        </div>

        <div className="rounded-lg border p-4 bg-muted/50">
          <div className="flex items-start space-x-3">
            <Info className="h-5 w-5 text-primary mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-sm font-medium">Why we need this</h4>
              <p className="text-xs text-muted-foreground">
                Your weight helps us calculate appropriate resistance levels and calorie expenditure for your workouts.
                We'll also use this to track your progress over time.
              </p>
            </div>
          </div>
        </div>

        <div className="relative pt-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-background px-2 text-xs text-muted-foreground">Weight Tracking</span>
          </div>
        </div>

        <div className="text-center space-y-2">
          <p className="text-sm">You'll be able to track your weight changes over time</p>
          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full" style={{ width: "30%" }}></div>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Starting Weight</span>
            <span>Current Progress</span>
            <span>Goal Weight</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => router.push("/onboarding/step-2")}>
          Back
        </Button>
        <Button onClick={handleNext} disabled={!weight}>
          Next
        </Button>
      </CardFooter>
    </Card>
  )
}
