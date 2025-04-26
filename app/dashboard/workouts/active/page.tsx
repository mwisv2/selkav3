"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Check, Clock, Dumbbell } from "lucide-react"
import { WorkoutTimer } from "@/components/workout-timer"

export default function ActiveWorkoutPage() {
  const router = useRouter()
  const [workout, setWorkout] = useState<any>(null)
  const [workoutTime, setWorkoutTime] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)

  useEffect(() => {
    // Get the current workout from localStorage
    const currentWorkout = localStorage.getItem("currentWorkout")
    if (currentWorkout) {
      try {
        const parsedWorkout = JSON.parse(currentWorkout)
        setWorkout(parsedWorkout)
      } catch (e) {
        console.error("Error parsing current workout:", e)
        router.push("/dashboard/workouts")
      }
    } else {
      // No workout found, redirect back to workouts page
      router.push("/dashboard/workouts")
    }
  }, [router])

  const handleSetComplete = (exerciseIndex: number, setIndex: number) => {
    if (isCompleted) return

    const updatedWorkout = { ...workout }
    updatedWorkout.exercises[exerciseIndex].sets[setIndex].completed =
      !updatedWorkout.exercises[exerciseIndex].sets[setIndex].completed

    setWorkout(updatedWorkout)
  }

  const handleWeightChange = (exerciseIndex: number, setIndex: number, value: string) => {
    if (isCompleted) return

    const updatedWorkout = { ...workout }
    updatedWorkout.exercises[exerciseIndex].sets[setIndex].weight = Number(value)

    setWorkout(updatedWorkout)
  }

  const handleRepsChange = (exerciseIndex: number, setIndex: number, value: string) => {
    if (isCompleted) return

    const updatedWorkout = { ...workout }
    updatedWorkout.exercises[exerciseIndex].sets[setIndex].reps = Number(value)

    setWorkout(updatedWorkout)
  }

  const handleCompleteWorkout = () => {
    if (!workout) return

    // Mark workout as completed
    setIsCompleted(true)

    // Create completed workout object
    const completedWorkout = {
      id: workout.id || Date.now().toString(),
      completedDate: new Date().toISOString(),
      title: workout.title,
      description: workout.description,
      duration: `${Math.ceil(workoutTime / 60)} min`,
      exercises: workout.exercises,
      actualTime: workoutTime, // Store the actual time in seconds
    }

    // Get existing completed workouts
    const completedWorkoutsStr = localStorage.getItem("completedWorkouts")
    const completedWorkouts = completedWorkoutsStr ? JSON.parse(completedWorkoutsStr) : []

    // Add new completed workout
    completedWorkouts.push(completedWorkout)
    localStorage.setItem("completedWorkouts", JSON.stringify(completedWorkouts))

    // Update workout stats
    const statsStr = localStorage.getItem("workoutStats")
    const stats = statsStr
      ? JSON.parse(statsStr)
      : {
          totalWorkouts: 0,
          completedWorkouts: 0,
          totalTime: 0,
          streak: 0,
        }

    // Update stats
    stats.totalWorkouts += 1
    stats.completedWorkouts += 1
    stats.totalTime += Math.ceil(workoutTime / 60) // Convert seconds to minutes

    // Update streak (simple implementation)
    const lastWorkoutDate = localStorage.getItem("lastWorkoutDate")
    const today = new Date().toDateString()

    if (lastWorkoutDate) {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayString = yesterday.toDateString()

      if (lastWorkoutDate === yesterdayString || lastWorkoutDate === today) {
        stats.streak += 1
      } else {
        stats.streak = 1
      }
    } else {
      stats.streak = 1
    }

    localStorage.setItem("workoutStats", JSON.stringify(stats))
    localStorage.setItem("lastWorkoutDate", today)

    // Update current week data
    const currentWeekStr = localStorage.getItem("currentWeek")
    const currentWeek = currentWeekStr
      ? JSON.parse(currentWeekStr)
      : {
          weekNumber: getWeekNumber(new Date()),
          completedWorkouts: [],
        }

    currentWeek.completedWorkouts.push(completedWorkout.id)
    localStorage.setItem("currentWeek", JSON.stringify(currentWeek))

    // Wait a moment before redirecting
    setTimeout(() => {
      router.push("/dashboard")
    }, 1500)
  }

  // Helper function to get week number
  const getWeekNumber = (date: Date) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1)
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
  }

  // Check if all sets are completed
  const allSetsCompleted = () => {
    if (!workout) return false

    return workout.exercises.every((exercise: any) => exercise.sets.every((set: any) => set.completed))
  }

  if (!workout) {
    return <div>Loading workout...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => router.push("/dashboard/workouts")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Workouts
        </Button>
        {!isCompleted && (
          <Button onClick={handleCompleteWorkout} disabled={!allSetsCompleted()}>
            <Check className="mr-2 h-4 w-4" />
            Complete Workout
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{workout.title}</CardTitle>
              <CardDescription>{workout.description}</CardDescription>
            </div>
            {isCompleted && (
              <div className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 px-3 py-1 rounded-full text-sm font-medium">
                Completed
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="mr-1 h-4 w-4" />
            <span>{workout.duration}</span>
            <span className="mx-2">•</span>
            <Dumbbell className="mr-1 h-4 w-4" />
            <span>{workout.exercises.length} exercises</span>
          </div>

          <WorkoutTimer onTimeUpdate={setWorkoutTime} isCompleted={isCompleted} />

          <div className="space-y-6">
            {workout.exercises.map((exercise: any, exerciseIndex: number) => (
              <div key={exerciseIndex} className="space-y-2">
                <h3 className="font-medium text-lg">{exercise.name}</h3>
                <p className="text-sm text-muted-foreground">Rest: {exercise.restTime}s between sets</p>

                <div className="space-y-2">
                  {exercise.sets.map((set: any, setIndex: number) => (
                    <div key={setIndex} className="flex items-center space-x-2 p-2 rounded-md border">
                      <Checkbox
                        id={`set-${exerciseIndex}-${setIndex}`}
                        checked={set.completed}
                        onCheckedChange={() => handleSetComplete(exerciseIndex, setIndex)}
                        disabled={isCompleted}
                      />
                      <Label htmlFor={`set-${exerciseIndex}-${setIndex}`} className="flex-1 cursor-pointer">
                        Set {setIndex + 1}
                      </Label>

                      <div className="flex items-center space-x-2">
                        <div className="w-16">
                          <Input
                            type="number"
                            value={set.weight}
                            onChange={(e) => handleWeightChange(exerciseIndex, setIndex, e.target.value)}
                            className="h-8"
                            disabled={isCompleted}
                          />
                          <div className="text-xs text-center text-muted-foreground">kg</div>
                        </div>
                        <div className="w-16">
                          <Input
                            type="number"
                            value={set.reps}
                            onChange={(e) => handleRepsChange(exerciseIndex, setIndex, e.target.value)}
                            className="h-8"
                            disabled={isCompleted}
                          />
                          <div className="text-xs text-center text-muted-foreground">reps</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {exerciseIndex < workout.exercises.length - 1 && <Separator className="my-4" />}
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          {isCompleted ? (
            <Button className="w-full" onClick={() => router.push("/dashboard")}>
              Return to Dashboard
            </Button>
          ) : (
            <Button className="w-full" onClick={handleCompleteWorkout} disabled={!allSetsCompleted()}>
              <Check className="mr-2 h-4 w-4" />
              Complete Workout
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
