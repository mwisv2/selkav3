"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { LigatureIcon as Bandage, Info } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

export default function Step13() {
  const router = useRouter()
  const [injuries, setInjuries] = useState<string[]>([])
  const [otherInjury, setOtherInjury] = useState("")

  const toggleInjury = (value: string) => {
    setInjuries((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]))
  }

  const handleNext = () => {
    // Save to localStorage for demo purposes
    const userProfile = JSON.parse(localStorage.getItem("userProfile") || "{}")

    // Combine selected injuries with custom input if provided
    const allInjuries = [...injuries]
    if (otherInjury.trim()) {
      allInjuries.push(`Other: ${otherInjury.trim()}`)
    }

    localStorage.setItem(
      "userProfile",
      JSON.stringify({
        ...userProfile,
        injuries: allInjuries,
      }),
    )
    router.push("/onboarding/complete")
  }

  // Calculate the total number of steps (now 14 with the new step)
  const totalSteps = 14
  const currentStep = 14
  const progressPercentage = (currentStep / totalSteps) * 100

  // Update the injury options to match the new injury modifications
  const commonInjuries = [
    "Knee Pain",
    "Lower Back Pain",
    "Shoulder Impingement",
    "Tennis Elbow",
    "Wrist Pain",
    "Ankle Sprain",
    "Hip Flexor Strain",
    "Neck Pain",
    "Hamstring Strain",
    "Elbow Pain",
  ]

  return (
    <Card className="w-full">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">Recent Injuries</CardTitle>
          <Bandage className="h-8 w-8 text-primary" />
        </div>
        <CardDescription>
          Let us know about any injuries or pain so we can customize your workouts accordingly
        </CardDescription>
        <Progress value={progressPercentage} className="h-2" />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>
            Step {currentStep} of {totalSteps}
          </span>
          <span>Health Considerations</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-lg border p-4 bg-muted/50">
          <div className="flex items-start space-x-3">
            <Info className="h-5 w-5 text-primary mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-sm font-medium">Safety First</h4>
              <p className="text-xs text-muted-foreground">
                We'll modify your workout plan to avoid exercises that might aggravate existing injuries. For serious
                injuries, please consult with a healthcare professional before starting any exercise program.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2">
          {commonInjuries.map((injury) => (
            <div
              key={injury}
              className={`flex items-center space-x-2 rounded-lg border p-3 transition-colors ${
                injuries.includes(injury) ? "border-primary bg-primary/5" : "hover:bg-muted/50"
              }`}
            >
              <Checkbox id={injury} checked={injuries.includes(injury)} onCheckedChange={() => toggleInjury(injury)} />
              <Label htmlFor={injury} className="flex-1 cursor-pointer">
                {injury}
              </Label>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <Label htmlFor="otherInjury">Other injuries or limitations (optional)</Label>
          <Textarea
            id="otherInjury"
            placeholder="Describe any other injuries or physical limitations..."
            value={otherInjury}
            onChange={(e) => setOtherInjury(e.target.value)}
            className="resize-none"
            rows={3}
          />
        </div>

        <div className="relative pt-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-background px-2 text-xs text-muted-foreground">How We'll Adapt</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 py-2">
          <div className="flex flex-col items-start p-3 rounded-lg border bg-background">
            <span className="text-xs text-muted-foreground mb-2">If you have shoulder pain:</span>
            <span className="text-xs">• Avoid overhead pressing</span>
            <span className="text-xs">• Modify chest exercises</span>
            <span className="text-xs">• Focus on rotator cuff strength</span>
          </div>
          <div className="flex flex-col items-start p-3 rounded-lg border bg-background">
            <span className="text-xs text-muted-foreground mb-2">If you have knee pain:</span>
            <span className="text-xs">• Reduce deep squatting</span>
            <span className="text-xs">• Modify jumping exercises</span>
            <span className="text-xs">• Focus on hip strength</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => router.push("/onboarding/step-12")}>
          Back
        </Button>
        <Button onClick={handleNext}>{injuries.length > 0 || otherInjury.trim() ? "Next" : "Skip"}</Button>
      </CardFooter>
    </Card>
  )
}
