"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Calendar, Info } from "lucide-react"

export default function Step4() {
  const router = useRouter()
  const [age, setAge] = useState("")

  const handleNext = () => {
    // Save to localStorage for demo purposes
    const userProfile = JSON.parse(localStorage.getItem("userProfile") || "{}")
    localStorage.setItem(
      "userProfile",
      JSON.stringify({
        ...userProfile,
        age,
      }),
    )
    router.push("/onboarding/step-5")
  }

  // Calculate the total number of steps (now 13 with the new steps)
  const totalSteps = 13
  const currentStep = 4
  const progressPercentage = (currentStep / totalSteps) * 100

  return (
    <Card className="w-full">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">Your Age</CardTitle>
          <Calendar className="h-8 w-8 text-primary" />
        </div>
        <CardDescription>Your age helps us customize workout intensity and recovery recommendations</CardDescription>
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
          <Label htmlFor="age">Age</Label>
          <Input id="age" type="number" placeholder="30" value={age} onChange={(e) => setAge(e.target.value)} />
        </div>

        <div className="rounded-lg border p-4 bg-muted/50">
          <div className="flex items-start space-x-3">
            <Info className="h-5 w-5 text-primary mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-sm font-medium">Why we need this</h4>
              <p className="text-xs text-muted-foreground">
                Different age groups have different fitness needs and recovery capabilities. We'll adjust your workout
                intensity and rest periods based on your age.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 py-2">
          <div className="flex flex-col items-center justify-center p-3 rounded-lg border bg-background">
            <span className="text-xs text-muted-foreground">Young Adult</span>
            <span className="text-lg font-medium">18-30</span>
            <span className="text-xs text-muted-foreground mt-1">Higher intensity</span>
          </div>
          <div className="flex flex-col items-center justify-center p-3 rounded-lg border bg-background">
            <span className="text-xs text-muted-foreground">Adult</span>
            <span className="text-lg font-medium">31-50</span>
            <span className="text-xs text-muted-foreground mt-1">Balanced approach</span>
          </div>
          <div className="flex flex-col items-center justify-center p-3 rounded-lg border bg-background">
            <span className="text-xs text-muted-foreground">Mature Adult</span>
            <span className="text-lg font-medium">51+</span>
            <span className="text-xs text-muted-foreground mt-1">Focus on form</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => router.push("/onboarding/step-3")}>
          Back
        </Button>
        <Button onClick={handleNext} disabled={!age}>
          Next
        </Button>
      </CardFooter>
    </Card>
  )
}
