"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Dumbbell, Search, Info } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function Step10() {
  const router = useRouter()
  const [equipment, setEquipment] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  const toggleEquipment = (value: string) => {
    setEquipment((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]))
  }

  const handleNext = () => {
    // Save to localStorage for demo purposes
    const userProfile = JSON.parse(localStorage.getItem("userProfile") || "{}")
    localStorage.setItem(
      "userProfile",
      JSON.stringify({
        ...userProfile,
        equipment,
      }),
    )
    router.push("/onboarding/step-10b")
  }

  // Calculate the total number of steps (now 14 with the new step)
  const totalSteps = 14
  const currentStep = 10
  const progressPercentage = (currentStep / totalSteps) * 100

  const equipmentOptions = [
    "Dumbbells",
    "Barbell",
    "Weight Plates",
    "Squat Rack",
    "Bench Press",
    "Pull-up Bar",
    "Resistance Bands",
    "Kettlebells",
    "Cable Machine",
    "Leg Press",
    "Smith Machine",
    "Treadmill",
    "Exercise Bike",
    "Elliptical",
    "No Equipment (Bodyweight only)",
  ]

  const filteredEquipment = searchTerm
    ? equipmentOptions.filter((item) => item.toLowerCase().includes(searchTerm.toLowerCase()))
    : equipmentOptions

  return (
    <Card className="w-full">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">Available Equipment</CardTitle>
          <Dumbbell className="h-8 w-8 text-primary" />
        </div>
        <CardDescription>Select the equipment you have access to for your workouts</CardDescription>
        <Progress value={progressPercentage} className="h-2" />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>
            Step {currentStep} of {totalSteps}
          </span>
          <span>Equipment</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search equipment..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="rounded-lg border p-4 bg-muted/50">
          <div className="flex items-start space-x-3">
            <Info className="h-5 w-5 text-primary mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-sm font-medium">Equipment Selection</h4>
              <p className="text-xs text-muted-foreground">
                We'll tailor your workouts to use only the equipment you have available. If you have no equipment,
                select "No Equipment (Bodyweight only)" for bodyweight exercises.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
          {filteredEquipment.map((item) => (
            <div
              key={item}
              className={`flex items-center space-x-2 rounded-lg border p-3 transition-colors ${
                equipment.includes(item) ? "border-primary bg-primary/5" : "hover:bg-muted/50"
              }`}
            >
              <Checkbox id={item} checked={equipment.includes(item)} onCheckedChange={() => toggleEquipment(item)} />
              <Label htmlFor={item} className="flex-1 cursor-pointer">
                {item}
              </Label>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => router.push("/onboarding/step-9")}>
          Back
        </Button>
        <Button onClick={handleNext} disabled={equipment.length === 0}>
          Next
        </Button>
      </CardFooter>
    </Card>
  )
}
