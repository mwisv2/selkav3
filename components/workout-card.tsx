"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Dumbbell, Play } from "lucide-react"
import { useRouter } from "next/navigation"

interface WorkoutCardProps {
  workout: any
  isToday?: boolean
}

export function WorkoutCard({ workout, isToday = false }: WorkoutCardProps) {
  const router = useRouter()
  const [isHovered, setIsHovered] = useState(false)

  const startWorkout = () => {
    // Store the current workout in localStorage
    localStorage.setItem("currentWorkout", JSON.stringify(workout))

    // Navigate to the active workout page
    router.push("/dashboard/workouts/active")
  }

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
            <CardTitle>{workout.title}</CardTitle>
            <CardDescription className="mt-1">{workout.description}</CardDescription>
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
          <span>{workout.duration}</span>
          <span className="mx-2">•</span>
          <Dumbbell className="mr-1 h-4 w-4" />
          <span>{workout.exercises?.length || 0} exercises</span>
        </div>

        <div className="space-y-1">
          {workout.exercises?.slice(0, 3).map((exercise: any, index: number) => (
            <div key={index} className="text-sm">
              {exercise.name}
            </div>
          ))}
          {(workout.exercises?.length || 0) > 3 && (
            <div className="text-sm text-muted-foreground">+{(workout.exercises?.length || 0) - 3} more exercises</div>
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
