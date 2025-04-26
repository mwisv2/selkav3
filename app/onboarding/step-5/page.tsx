"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Target, TrendingUp, Scale, Flame, Dumbbell } from "lucide-react"

export default function Step5() {
  const router = useRouter()
  const [goal, setGoal] = useState("")

  const handleNext = () => {
    // Save to localStorage for demo purposes
    const userProfile = JSON.parse(localStorage.getItem("userProfile") || "{}")
    localStorage.setItem(
      "userProfile",
      JSON.stringify({
        ...userProfile,
        goal,
      }),
    )
    router.push("/onboarding/step-6")
  }

  // Calculate the total number of steps (now 13 with the new steps)
  const totalSteps = 13
  const currentStep = 5
  const progressPercentage = (currentStep / totalSteps) * 100

  const goals = [
    {
      value: "lose_weight",
      label: "Lose Weight",
      icon: Scale,
      description: "Reduce body weight through calorie deficit",
    },
    {
      value: "gain_weight",
      label: "Gain Weight",
      icon: TrendingUp,
      description: "Increase body weight and muscle mass",
    },
    {
      value: "maintain_weight",
      label: "Maintain Weight",
      icon: Target,
      description: "Keep current weight while improving fitness",
    },
    {
      value: "lose_fat",
      label: "Lose Fat",
      icon: Flame,
      description: "Reduce body fat percentage while maintaining muscle",
    },
    { value: "gain_muscle", label: "Gain Muscle", icon: Dumbbell, description: "Build muscle mass and strength" },
  ]

  return (
    <Card className="w-full">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">Your Goal</CardTitle>
          <Target className="h-8 w-8 text-primary" />
        </div>
        <CardDescription>Select your primary fitness goal so we can tailor your workout plan</CardDescription>
        <Progress value={progressPercentage} className="h-2" />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>
            Step {currentStep} of {totalSteps}
          </span>
          <span>Goals & Preferences</span>
        </div>
      </CardHeader>
      <CardContent>
        <RadioGroup value={goal} onValueChange={setGoal} className="space-y-3">
          {goals.map((item) => (
            <div
              key={item.value}
              className={`flex items-center space-x-2 rounded-lg border p-4 transition-colors ${
                goal === item.value ? "border-primary bg-primary/5" : "hover:bg-muted/50"
              }`}
            >
              <RadioGroupItem value={item.value} id={item.value} className="mt-0.5" />
              <div className="flex flex-1 items-center justify-between">
                <Label htmlFor={item.value} className="flex items-center cursor-pointer">
                  <item.icon className="mr-3 h-5 w-5 text-primary" />
                  <div>
                    <span className="font-medium">{item.label}</span>
                    <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                  </div>
                </Label>
              </div>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => router.push("/onboarding/step-4")}>
          Back
        </Button>
        <Button onClick={handleNext} disabled={!goal}>
          Next
        </Button>
      </CardFooter>
    </Card>
  )
}
