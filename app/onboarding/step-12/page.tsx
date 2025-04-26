"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Activity, Info } from "lucide-react"

// Add the import for generateWorkouts
import { generateWorkouts } from "@/components/generate-workouts"

export default function Step12() {
  const router = useRouter()
  const [experienceLevel, setExperienceLevel] = useState("")

  const handleNext = () => {
    // Save to localStorage for demo purposes
    const userProfile = JSON.parse(localStorage.getItem("userProfile") || "{}")

    // Update user profile with experience level
    localStorage.setItem(
      "userProfile",
      JSON.stringify({
        ...userProfile,
        experienceLevel,
      }),
    )

    // Mark this step as completed
    localStorage.setItem("step12Completed", "true")

    // Generate workouts based on updated profile if not already generated
    if (!localStorage.getItem("generatedWorkouts")) {
      try {
        const updatedProfile = { ...userProfile, experienceLevel }
        const workouts = generateWorkouts(updatedProfile)
        localStorage.setItem("generatedWorkouts", JSON.stringify(workouts))
      } catch (error) {
        console.error("Error generating workouts:", error)
        // Still save an empty array to prevent future errors
        localStorage.setItem("generatedWorkouts", "[]")
      }
    }

    router.push("/onboarding/step-13")
  }

  // Calculate the total number of steps (now 14 with the new step)
  const totalSteps = 14
  const currentStep = 13
  const progressPercentage = (currentStep / totalSteps) * 100

  const experienceLevels = [
    {
      value: "beginner",
      label: "Beginner",
      description: "New to fitness or returning after a long break (0-1 year of consistent training)",
    },
    {
      value: "intermediate",
      label: "Intermediate",
      description: "Regular training experience with proper form (1-3 years of consistent training)",
    },
    {
      value: "advanced",
      label: "Advanced",
      description: "Extensive training experience with good strength levels (3+ years of consistent training)",
    },
  ]

  return (
    <Card className="w-full">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">Experience Level</CardTitle>
          <Activity className="h-8 w-8 text-primary" />
        </div>
        <CardDescription>Select your fitness experience level to help us tailor your workout intensity</CardDescription>
        <Progress value={progressPercentage} className="h-2" />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>
            Step {currentStep} of {totalSteps}
          </span>
          <span>Experience</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-lg border p-4 bg-muted/50">
          <div className="flex items-start space-x-3">
            <Info className="h-5 w-5 text-primary mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-sm font-medium">Why This Matters</h4>
              <p className="text-xs text-muted-foreground">
                Your experience level helps us determine appropriate exercise complexity, volume, and intensity.
                Beginners need to focus on form, while advanced trainees need more challenging progressions.
              </p>
            </div>
          </div>
        </div>

        <RadioGroup value={experienceLevel} onValueChange={setExperienceLevel} className="space-y-3">
          {experienceLevels.map((level) => (
            <div
              key={level.value}
              className={`flex items-center space-x-2 rounded-lg border p-4 transition-colors ${
                experienceLevel === level.value ? "border-primary bg-primary/5" : "hover:bg-muted/50"
              }`}
            >
              <RadioGroupItem value={level.value} id={level.value} className="mt-0.5" />
              <div className="flex flex-1 items-center justify-between">
                <Label htmlFor={level.value} className="flex items-center cursor-pointer">
                  <div>
                    <span className="font-medium">{level.label}</span>
                    <p className="text-xs text-muted-foreground mt-1">{level.description}</p>
                  </div>
                </Label>
              </div>
            </div>
          ))}
        </RadioGroup>

        <div className="grid grid-cols-3 gap-4 py-2">
          <div className="flex flex-col items-center justify-center p-3 rounded-lg border bg-background">
            <span className="text-xs text-muted-foreground">Beginner</span>
            <span className="text-sm font-medium mt-2">Focus on form</span>
            <span className="text-sm font-medium">Lower volume</span>
            <span className="text-sm font-medium">Basic exercises</span>
          </div>
          <div className="flex flex-col items-center justify-center p-3 rounded-lg border bg-background">
            <span className="text-xs text-muted-foreground">Intermediate</span>
            <span className="text-sm font-medium mt-2">Progressive overload</span>
            <span className="text-sm font-medium">Moderate volume</span>
            <span className="text-sm font-medium">Varied exercises</span>
          </div>
          <div className="flex flex-col items-center justify-center p-3 rounded-lg border bg-background">
            <span className="text-xs text-muted-foreground">Advanced</span>
            <span className="text-sm font-medium mt-2">Periodization</span>
            <span className="text-sm font-medium">Higher volume</span>
            <span className="text-sm font-medium">Complex techniques</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => router.push("/onboarding/step-11")}>
          Back
        </Button>
        <Button onClick={handleNext} disabled={!experienceLevel}>
          Next
        </Button>
      </CardFooter>
    </Card>
  )
}
