"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Dumbbell, Play } from "lucide-react"
import { useRouter } from "next/navigation"

interface WorkoutCardProps {
  workout?: any
  isToday?: boolean
}

export function WorkoutCard({ workout, isToday = false }: WorkoutCardProps) {
  const router = useRouter()
  const [isHovered, setIsHovered] = useState(false)

  // Return null if workout is undefined or null
  if (!workout) {
    return null
  }

  const startWorkout = () => {
    // Ensure the workout has proper exercise objects before storing
    const workoutToStore = { ...workout }

    // If exercises is an array of strings, convert them to proper exercise objects
    if (Array.isArray(workoutToStore.exercises)) {
      workoutToStore.exercises = workoutToStore.exercises.map((exercise: any, index: number) => {
        if (typeof exercise === "string") {
          // Convert string exercise to object with name
          return {
            name: exercise,
            sets: Array(4)
              .fill(0)
              .map(() => ({
                weight: 0,
                reps: 10,
                completed: false,
              })),
            restTime: 60,
          }
        }
        return exercise
      })
    } else {
      // If exercises is not an array, initialize it as an empty array
      workoutToStore.exercises = []
    }

    // Store the current workout in localStorage
    localStorage.setItem("currentWorkout", JSON.stringify(workoutToStore))

    // Navigate to the active workout page
    router.push("/dashboard/workouts/active")
  }

  // Use optional chaining and provide default values for all properties
  const title = workout?.title || "Untitled Workout"
  const description = workout?.description || "No description available"
  const duration = workout?.duration || "0 min"
  const exercises = Array.isArray(workout?.exercises) ? workout.exercises : []

  return (
    <Card
      className={`overflow-hidden transition-all duration-300 ${
        isToday ? "border-primary shadow-md" : ""
      } ${isHovered ? "shadow-lg transform -translate-y-1" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription className="mt-1">{description}</CardDescription>
          </div>
          {isToday && (
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
              Today
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-center text-sm text-muted-foreground mb-4">
          <Clock className="mr-1 h-4 w-4" />
          <span>{duration}</span>
          <span className="mx-2">•</span>
          <Dumbbell className="mr-1 h-4 w-4" />
          <span>{exercises.length} exercises</span>
        </div>

        <div className="space-y-1">
          {exercises.slice(0, 3).map((exercise: any, index: number) => (
            <div key={index} className="text-sm">
              {typeof exercise === "string" ? exercise : exercise?.name || `Exercise ${index + 1}`}
            </div>
          ))}
          {exercises.length > 3 && (
            <div className="text-sm text-muted-foreground">+{exercises.length - 3} more exercises</div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={startWorkout} className="w-full" variant={isToday ? "default" : "outline"}>
          <Play className="mr-2 h-4 w-4" />
          Start Workout
        </Button>
      </CardFooter>
    </Card>
  )
}
