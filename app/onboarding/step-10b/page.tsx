"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { WeightIcon, Plus, Info } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function Step10b() {
  const router = useRouter()
  const [userProfile, setUserProfile] = useState<any>(null)
  const [equipmentWeights, setEquipmentWeights] = useState<{ [key: string]: number[] }>({})
  const [newWeight, setNewWeight] = useState<{ [key: string]: string }>({})
  const [isLoading, setIsLoading] = useState(true)

  // Load the user profile to get selected equipment
  useEffect(() => {
    const profile = localStorage.getItem("userProfile")
    if (profile) {
      const parsedProfile = JSON.parse(profile)
      setUserProfile(parsedProfile)

      // Initialize equipmentWeights with empty arrays for each applicable equipment
      const initialWeights: { [key: string]: number[] } = {}
      if (parsedProfile.equipment && Array.isArray(parsedProfile.equipment)) {
        parsedProfile.equipment.forEach((item: string) => {
          if (needsWeightSpecification(item)) {
            initialWeights[item] = parsedProfile.equipmentWeights?.[item] || []
          }
        })
      }
      setEquipmentWeights(initialWeights)

      // Initialize newWeight object
      const initialNewWeight: { [key: string]: string } = {}
      if (parsedProfile.equipment && Array.isArray(parsedProfile.equipment)) {
        parsedProfile.equipment.forEach((item: string) => {
          if (needsWeightSpecification(item)) {
            initialNewWeight[item] = ""
          }
        })
      }
      setNewWeight(initialNewWeight)

      setIsLoading(false)
    } else {
      router.push("/onboarding/step-1")
    }
  }, [router])

  // Function to check if equipment needs weight specification
  const needsWeightSpecification = (equipment: string) => {
    return ["Dumbbells", "Kettlebells", "Barbell", "Weight Plates"].includes(equipment)
  }

  // Add a new weight for an equipment type
  const addWeight = (equipment: string) => {
    if (!newWeight[equipment] || isNaN(Number(newWeight[equipment])) || Number(newWeight[equipment]) <= 0) return

    const weight = Number(newWeight[equipment])
    setEquipmentWeights((prev) => ({
      ...prev,
      [equipment]: [...(prev[equipment] || []), weight].sort((a, b) => a - b),
    }))
    setNewWeight((prev) => ({ ...prev, [equipment]: "" }))
  }

  // Remove a weight from an equipment type
  const removeWeight = (equipment: string, weight: number) => {
    setEquipmentWeights((prev) => ({
      ...prev,
      [equipment]: prev[equipment].filter((w) => w !== weight),
    }))
  }

  // Get appropriate weight unit
  const getWeightUnit = (equipment: string) => {
    // Most commonly weights are in kg, but you can customize this if needed
    return "kg"
  }

  const getWeightLabel = (equipment: string) => {
    if (equipment === "Dumbbells") {
      return "pair"
    } else if (equipment === "Weight Plates") {
      return "pair"
    } else {
      return "kg"
    }
  }

  const handleNext = () => {
    // Save equipment weights to the user profile
    const updatedProfile = {
      ...userProfile,
      equipmentWeights,
    }

    localStorage.setItem("userProfile", JSON.stringify(updatedProfile))
    router.push("/onboarding/step-11")
  }

  // Calculate the total number of steps (now 14 with the new step)
  const totalSteps = 14
  const currentStep = 11
  const progressPercentage = (currentStep / totalSteps) * 100

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl">Loading...</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    )
  }

  // Get equipment that needs weight specification
  const applicableEquipment = userProfile?.equipment?.filter(needsWeightSpecification) || []

  return (
    <Card className="w-full">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">Your Equipment Weights</CardTitle>
          <WeightIcon className="h-8 w-8 text-primary" />
        </div>
        <CardDescription>Specify the weights you have available for each type of equipment</CardDescription>
        <Progress value={progressPercentage} className="h-2" />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>
            Step {currentStep} of {totalSteps}
          </span>
          <span>Equipment Details</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {applicableEquipment.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-muted-foreground">
              No equipment requiring weight specification was selected. You can proceed to the next step.
            </p>
          </div>
        ) : (
          <>
            <div className="rounded-lg border p-4 bg-muted/50">
              <div className="flex items-start space-x-3">
                <Info className="h-5 w-5 text-primary mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-sm font-medium">Why This Matters</h4>
                  <p className="text-xs text-muted-foreground">
                    Specifying your available weights helps us generate workouts that you can actually perform. We'll
                    only include exercises that use weights you own, making your workout plan truly personalized.
                  </p>
                </div>
              </div>
            </div>

            <Accordion type="single" collapsible className="w-full">
              {applicableEquipment.map((equipment: string) => (
                <AccordionItem key={equipment} value={equipment}>
                  <AccordionTrigger className="text-base font-medium">
                    {equipment}
                    <div className="flex-1 flex justify-end mr-4">
                      <span className="text-sm text-muted-foreground">
                        {equipmentWeights[equipment]?.length || 0} weights
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 p-2">
                      <div className="flex flex-wrap gap-2 mb-2">
                        {equipmentWeights[equipment]?.map((weight) => (
                          <Badge key={weight} className="flex items-center space-x-1" variant="outline">
                            <span>
                              {weight} kg {equipment === "Dumbbells" || equipment === "Weight Plates" ? "(pair)" : ""}
                            </span>
                            <button
                              onClick={() => removeWeight(equipment, weight)}
                              className="ml-1 h-4 w-4 rounded-full hover:bg-muted-foreground/20 inline-flex items-center justify-center"
                            >
                              <span className="sr-only">Remove</span>
                              <span>×</span>
                            </button>
                          </Badge>
                        ))}
                        {equipmentWeights[equipment]?.length === 0 && (
                          <span className="text-sm text-muted-foreground">No weights added yet</span>
                        )}
                      </div>

                      <div className="flex space-x-2">
                        <div className="flex-1">
                          <Input
                            type="number"
                            placeholder={`Enter weight in ${getWeightUnit(equipment)}`}
                            value={newWeight[equipment]}
                            onChange={(e) => {
                              setNewWeight((prev) => ({
                                ...prev,
                                [equipment]: e.target.value,
                              }))
                            }}
                            min="0"
                            step="0.5"
                          />
                        </div>
                        <Button size="sm" onClick={() => addWeight(equipment)} disabled={!newWeight[equipment]}>
                          <Plus className="h-4 w-4 mr-1" /> Add
                        </Button>
                      </div>

                      {equipment === "Dumbbells" && (
                        <div className="text-sm text-muted-foreground mt-2">
                          <p>
                            Add each dumbbell weight you own (e.g., 2, 5, 10, 15 kg). Each entry represents a{" "}
                            <strong>pair</strong> of dumbbells.
                          </p>
                        </div>
                      )}

                      {equipment === "Kettlebells" && (
                        <div className="text-sm text-muted-foreground mt-2">
                          <p>Add each kettlebell weight you own (e.g., 8, 12, 16 kg)</p>
                        </div>
                      )}

                      {equipment === "Barbell" && (
                        <div className="text-sm text-muted-foreground mt-2">
                          <p>
                            Add your barbell weight (typically 20kg for standard Olympic bar, 15kg for women's Olympic
                            bar, or 10kg for training bar)
                          </p>
                        </div>
                      )}

                      {equipment === "Weight Plates" && (
                        <div className="text-sm text-muted-foreground mt-2">
                          <p>
                            Add each plate weight you own (e.g., 1.25, 2.5, 5, 10, 20 kg). Each entry represents a{" "}
                            <strong>pair</strong> of plates (2 plates of the same weight).
                          </p>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => router.push("/onboarding/step-10")}>
          Back
        </Button>
        <Button onClick={handleNext}>Next</Button>
      </CardFooter>
    </Card>
  )
}
