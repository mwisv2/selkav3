"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  SkipForward,
  Loader2,
  Timer,
  Dumbbell,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"

export default function ActiveWorkoutPage() {
  const router = useRouter()
  const [workout, setWorkout] = useState<any>(null)
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [currentSetIndex, setCurrentSetIndex] = useState(0)
  const [restTimer, setRestTimer] = useState(0)
  const [isResting, setIsResting] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [workoutComplete, setWorkoutComplete] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [userProfile, setUserProfile] = useState<any>(null)

  // Workout timer state
  const [workoutStartTime, setWorkoutStartTime] = useState<number | null>(null)
  const [workoutDuration, setWorkoutDuration] = useState(0)
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null)

  // Add these after the existing timer state variables
  const [totalPausedTime, setTotalPausedTime] = useState(0)
  const [pauseStartTime, setPauseStartTime] = useState<number | null>(null)

  // Feedback system state
  const [showFeedback, setShowFeedback] = useState(false)
  const [feedbackStep, setFeedbackStep] = useState<"type" | "adjustment">("type")
  const [feedbackType, setFeedbackType] = useState<string>("")
  const [feedbackAdjustment, setFeedbackAdjustment] = useState<"too_high" | "too_low" | "">("")
  const [weightFeedback, setWeightFeedback] = useState<number>(0)
  const [repsFeedback, setRepsFeedback] = useState<number>(0)
  const [restFeedback, setRestFeedback] = useState<number>(0)
  const [availableWeights, setAvailableWeights] = useState<{ [key: string]: number[] }>({})
  const [pendingNextSet, setPendingNextSet] = useState(false)

  // Load user profile and workout from localStorage
  useEffect(() => {
    // Load user profile first
    const userProfileData = localStorage.getItem("userProfile")
    if (userProfileData) {
      try {
        const parsedProfile = JSON.parse(userProfileData)
        setUserProfile(parsedProfile)

        // Extract available weights from user profile
        const equipmentWeights: { [key: string]: number[] } = parsedProfile.equipmentWeights || {}
        setAvailableWeights(equipmentWeights)

        // Now load the workout
        const currentWorkout = localStorage.getItem("currentWorkout")
        if (currentWorkout) {
          try {
            const parsedWorkout = JSON.parse(currentWorkout)

            // Process workout with user's equipment and weights
            const processedWorkout = processWorkoutWithUserEquipment(parsedWorkout, parsedProfile)
            setWorkout(processedWorkout)

            // Start the workout timer
            const startTime = Date.now()
            setWorkoutStartTime(startTime)

            const interval = setInterval(() => {
              if (!isPaused) {
                const currentDuration = Math.floor((Date.now() - startTime) / 1000)
                setWorkoutDuration(currentDuration)
              }
            }, 1000)

            setTimerInterval(interval)
          } catch (e) {
            console.error("Error parsing current workout:", e)
            router.push("/dashboard/workouts")
          }
        } else {
          // No workout found, redirect back to workouts page
          router.push("/dashboard/workouts")
        }
      } catch (e) {
        console.error("Error parsing user profile:", e)
      }
    } else {
      console.error("No user profile found")
      router.push("/dashboard")
    }

    return () => {
      if (timerInterval) {
        clearInterval(timerInterval)
      }
    }
  }, [])

  // Process workout to ensure it only uses equipment and weights the user has
  const processWorkoutWithUserEquipment = (workout: any, userProfile: any) => {
    if (!workout || !workout.exercises) return workout

    const userEquipment = userProfile.equipment || ["No Equipment (Bodyweight only)"]
    const equipmentWeights = userProfile.equipmentWeights || {}

    // Process each exercise
    const processedExercises = workout.exercises.map((exercise: any) => {
      // Determine what equipment this exercise uses
      const exerciseEquipment = getExerciseEquipment(exercise.name)

      // Check if user has this equipment
      const hasEquipment = exerciseEquipment === "Bodyweight" || userEquipment.includes(exerciseEquipment)

      // If user doesn't have the equipment, try to find an alternative
      if (!hasEquipment) {
        const alternativeExercise = findAlternativeExercise(exercise.name, userEquipment)
        if (alternativeExercise) {
          exercise.name = alternativeExercise
          exercise.equipmentType = getExerciseEquipment(alternativeExercise)
        }
      } else {
        exercise.equipmentType = exerciseEquipment
      }

      // Process sets to use available weights
      if (exercise.sets && exercise.sets.length > 0) {
        exercise.sets = exercise.sets.map((set: any, index: number) => {
          // Get appropriate weight based on what user has available
          const { weight, equipmentDescription } = getAppropriateWeight(
            set.weight,
            exercise.equipmentType,
            equipmentWeights,
            index,
          )

          return {
            ...set,
            weight,
            equipmentConfiguration: equipmentDescription,
          }
        })
      }

      return exercise
    })

    return {
      ...workout,
      exercises: processedExercises,
    }
  }

  // Determine what equipment an exercise uses
  const getExerciseEquipment = (exerciseName: string): string => {
    const name = exerciseName.toLowerCase()

    if (name.includes("dumbbell")) return "Dumbbells"
    if (name.includes("barbell")) return "Barbell"
    if (name.includes("kettlebell")) return "Kettlebells"
    if (name.includes("resistance band")) return "Resistance Bands"
    if (name.includes("cable")) return "Cable Machine"
    if (name.includes("machine")) return "Machine"
    if (name.includes("treadmill")) return "Treadmill"
    if (name.includes("elliptical")) return "Elliptical"

    // Default to bodyweight if no equipment is specified
    return "Bodyweight"
  }

  // Find an alternative exercise that uses equipment the user has
  const findAlternativeExercise = (exerciseName: string, userEquipment: string[]): string => {
    const name = exerciseName.toLowerCase()
    const hasBodyweight = userEquipment.includes("No Equipment (Bodyweight only)")
    const hasDumbbells = userEquipment.includes("Dumbbells")
    const hasResistanceBands = userEquipment.includes("Resistance Bands")

    // Map barbell exercises to dumbbell or bodyweight alternatives
    if (name.includes("barbell bench press") && hasDumbbells) return "Dumbbell Bench Press"
    if (name.includes("barbell bench press") && hasBodyweight) return "Push-ups"

    if (name.includes("barbell squat") && hasDumbbells) return "Dumbbell Goblet Squats"
    if (name.includes("barbell squat") && hasBodyweight) return "Squats"

    if (name.includes("barbell deadlift") && hasDumbbells) return "Dumbbell Romanian Deadlift"
    if (name.includes("barbell deadlift") && hasBodyweight) return "Glute Bridges"

    if (name.includes("barbell overhead press") && hasDumbbells) return "Dumbbell Shoulder Press"
    if (name.includes("barbell overhead press") && hasBodyweight) return "Pike Push-ups"

    if (name.includes("barbell row") && hasDumbbells) return "Dumbbell Rows"
    if (name.includes("barbell row") && hasBodyweight) return "Inverted Rows"

    // Map cable exercises to resistance band or bodyweight alternatives
    if (name.includes("cable") && hasResistanceBands) {
      return name.replace("Cable", "Resistance Band")
    }
    if (name.includes("cable chest fly") && hasBodyweight) return "Push-ups"
    if (name.includes("cable row") && hasBodyweight) return "Inverted Rows"

    // If no specific alternative, default to a basic bodyweight exercise
    if (hasBodyweight) {
      if (name.includes("chest")) return "Push-ups"
      if (name.includes("back")) return "Inverted Rows"
      if (name.includes("shoulder")) return "Pike Push-ups"
      if (name.includes("leg") || name.includes("squat")) return "Squats"
      if (name.includes("core")) return "Plank"
    }

    // If we can't find a good alternative, return the original
    return exerciseName
  }

  // Get appropriate weight based on user's available weights
  const getAppropriateWeight = (
    targetWeight: number,
    equipmentType: string,
    equipmentWeights: { [key: string]: number[] },
    setIndex: number,
  ): { weight: number; equipmentDescription: string } => {
    // For bodyweight exercises
    if (equipmentType === "Bodyweight" || equipmentType === "No Equipment (Bodyweight only)") {
      return { weight: 0, equipmentDescription: "Bodyweight only" }
    }

    // For equipment with available weights
    if (equipmentWeights[equipmentType] && equipmentWeights[equipmentType].length > 0) {
      const availableWeights = [...equipmentWeights[equipmentType]].sort((a, b) => a - b)

      // Find the closest available weight
      let closestWeight = availableWeights[0]
      let minDiff = Math.abs(targetWeight - availableWeights[0])

      for (let i = 1; i < availableWeights.length; i++) {
        const diff = Math.abs(targetWeight - availableWeights[i])
        if (diff < minDiff) {
          minDiff = diff
          closestWeight = availableWeights[i]
        }
      }

      // For progressive loading in sets
      if (setIndex > 0 && setIndex < availableWeights.length) {
        // Try to create a progressive loading pattern if possible
        const sortedWeights = [...availableWeights].sort((a, b) => a - b)
        const midIndex = Math.floor(sortedWeights.length / 2)

        // For first set, use a lighter weight if available
        if (setIndex === 0 && sortedWeights.length > 1) {
          closestWeight = sortedWeights[Math.max(0, midIndex - 1)]
        }
        // For middle sets, use a medium weight
        else if (setIndex === 1 && sortedWeights.length > 2) {
          closestWeight = sortedWeights[midIndex]
        }
        // For last sets, use a heavier weight if available
        else if (setIndex === 2 && sortedWeights.length > 2) {
          closestWeight = sortedWeights[Math.min(sortedWeights.length - 1, midIndex + 1)]
        }
      }

      let equipmentDescription = ""
      if (equipmentType === "Dumbbells") {
        equipmentDescription = `${closestWeight}kg dumbbells (pair)`
      } else if (equipmentType === "Kettlebells") {
        equipmentDescription = `${closestWeight}kg kettlebell`
      } else if (equipmentType === "Barbell") {
        // For barbell, we need to calculate plate configuration
        const barbellWeight = 20 // Standard barbell weight
        const plates = equipmentWeights["Weight Plates"] || []

        if (closestWeight <= barbellWeight) {
          equipmentDescription = `${barbellWeight}kg barbell (empty)`
        } else {
          const plateWeight = closestWeight - barbellWeight
          equipmentDescription = `${barbellWeight}kg barbell + plates (${plateWeight}kg total)`
        }
      } else {
        equipmentDescription = `${closestWeight}kg ${equipmentType}`
      }

      return { weight: closestWeight, equipmentDescription }
    }

    // Default case if no weights are specified
    return {
      weight: 0,
      equipmentDescription:
        equipmentType === "Bodyweight" ? "Bodyweight only" : `${equipmentType} (no weight specified)`,
    }
  }

  // Update timer when pause state changes
  useEffect(() => {
    if (workoutStartTime && isPaused && timerInterval) {
      clearInterval(timerInterval)
      setTimerInterval(null)
    } else if (workoutStartTime && !isPaused && !timerInterval) {
      const adjustedStartTime = Date.now() - workoutDuration * 1000

      const interval = setInterval(() => {
        const currentDuration = Math.floor((Date.now() - adjustedStartTime) / 1000)
        setWorkoutDuration(currentDuration)
      }, 1000)

      setTimerInterval(interval)
    }
  }, [isPaused, workoutStartTime])

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio("/beep.mp3")
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
      }
    }
  }, [])

  // Rest timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isResting && !isPaused && restTimer > 0) {
      interval = setInterval(() => {
        setRestTimer((prev) => {
          if (prev <= 1) {
            // Play sound when timer ends
            if (audioRef.current) {
              audioRef.current.play().catch((e) => console.error("Error playing audio:", e))
            }
            clearInterval(interval!)

            // If we have a pending next set (feedback was completed), move to next set
            if (pendingNextSet) {
              moveToNextSet()
              setPendingNextSet(false)
            } else {
              setIsResting(false)
            }

            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isResting, isPaused, restTimer, pendingNextSet])

  // Calculate overall progress
  const calculateProgress = () => {
    if (!workout || !workout.exercises) return 0

    const totalSets = workout.exercises.reduce((acc, exercise) => acc + (exercise?.sets?.length || 0), 0)

    const completedSets = workout.exercises.reduce(
      (acc, exercise) => acc + (exercise?.sets?.filter((set) => set?.completed)?.length || 0),
      0,
    )

    return totalSets > 0 ? (completedSets / totalSets) * 100 : 0
  }

  // Format time function
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    return `${hours > 0 ? `${hours}:` : ""}${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleCompleteSet = () => {
    if (!workout || !workout.exercises) {
      console.error("Cannot complete set: workout data is not fully loaded")
      return
    }

    const updatedWorkout = { ...workout }
    const currentExercise = updatedWorkout.exercises[currentExerciseIndex]

    if (!currentExercise || !currentExercise.sets) {
      console.error("Cannot complete set: current exercise or sets are undefined")
      return
    }

    // Mark current set as completed
    if (currentExercise && currentExercise.sets && currentExercise.sets[currentSetIndex]) {
      currentExercise.sets[currentSetIndex].completed = true
    }

    setWorkout(updatedWorkout)

    // Start rest timer immediately
    setRestTimer(currentExercise?.restTime || 60)
    setIsResting(true)

    // Reset feedback state
    setFeedbackStep("type")
    setFeedbackType("")
    setFeedbackAdjustment("")

    // Initialize feedback values
    setWeightFeedback(currentExercise?.sets?.[currentSetIndex]?.weight || 0)
    setRepsFeedback(currentExercise?.sets?.[currentSetIndex]?.reps || 0)
    setRestFeedback(currentExercise?.restTime || 60)

    // Show feedback dialog during rest
    setShowFeedback(true)
  }

  const handleFeedbackTypeSelect = (type: string) => {
    setFeedbackType(type)
    setFeedbackStep("adjustment")
  }

  const handleFeedbackAdjustmentSelect = (adjustment: "too_high" | "too_low") => {
    setFeedbackAdjustment(adjustment)

    // Auto-adjust values based on selection
    const currentExercise = workout.exercises[currentExerciseIndex]
    const currentSet = currentExercise.sets[currentSetIndex]
    const equipmentType = currentExercise.equipmentType || getExerciseEquipment(currentExercise.name)

    if (feedbackType === "weight") {
      // Get available weights for this equipment type
      const weights = availableWeights[equipmentType] || []

      if (weights.length > 0) {
        // Sort weights
        const sortedWeights = [...weights].sort((a, b) => a - b)

        // Find current weight index
        const currentIndex = sortedWeights.findIndex((w) => w === currentSet.weight)

        if (adjustment === "too_high") {
          // Too heavy - go down one weight if possible
          if (currentIndex > 0) {
            setWeightFeedback(sortedWeights[currentIndex - 1])
          } else {
            setWeightFeedback(sortedWeights[0]) // Use lightest weight
          }
        } else {
          // Too light - go up one weight if possible
          if (currentIndex < sortedWeights.length - 1) {
            setWeightFeedback(sortedWeights[currentIndex + 1])
          } else {
            setWeightFeedback(sortedWeights[sortedWeights.length - 1]) // Use heaviest weight
          }
        }
      } else {
        // No specific weights available, use percentage adjustment
        if (adjustment === "too_high") {
          setWeightFeedback(Math.max(0, Math.floor(currentSet.weight * 0.85)))
        } else {
          setWeightFeedback(Math.ceil(currentSet.weight * 1.15))
        }
      }
    } else if (feedbackType === "reps") {
      if (adjustment === "too_high") {
        // Too many reps - reduce by 2-3
        setRepsFeedback(Math.max(1, currentSet.reps - 2))
      } else {
        // Too few reps - increase by 2
        setRepsFeedback(currentSet.reps + 2)
      }
    } else if (feedbackType === "rest") {
      if (adjustment === "too_high") {
        // Rest too long - reduce by 15-30 seconds
        setRestFeedback(Math.max(15, (currentExercise.restTime || 60) - 15))
      } else {
        // Rest too short - increase by 15-30 seconds
        setRestFeedback((currentExercise.restTime || 60) + 15)
      }
    }
  }

  const handleFeedbackSubmit = () => {
    setShowFeedback(false)

    // Apply feedback to current exercise
    const updatedWorkout = { ...workout }
    const currentExercise = updatedWorkout.exercises[currentExerciseIndex]
    const equipmentType = currentExercise.equipmentType || getExerciseEquipment(currentExercise.name)

    // Adjust future sets based on feedback
    if (feedbackType === "weight") {
      // Adjust remaining sets' weight
      for (let i = currentSetIndex + 1; i < currentExercise.sets.length; i++) {
        currentExercise.sets[i].weight = weightFeedback

        // Update equipment configuration description
        const { equipmentDescription } = getAppropriateWeight(weightFeedback, equipmentType, availableWeights, i)
        currentExercise.sets[i].equipmentConfiguration = equipmentDescription
      }
    } else if (feedbackType === "reps") {
      // Adjust remaining sets' reps
      for (let i = currentSetIndex + 1; i < currentExercise.sets.length; i++) {
        currentExercise.sets[i].reps = repsFeedback
      }
    } else if (feedbackType === "rest") {
      // Adjust rest time for this exercise
      currentExercise.restTime = restFeedback

      // Update current rest timer if it's still running
      if (isResting && restTimer > 0) {
        setRestTimer(restFeedback)
      }
    }

    setWorkout(updatedWorkout)

    // If rest is already over, move to next set immediately
    // Otherwise, mark that we should move to next set when rest ends
    if (!isResting || restTimer <= 0) {
      moveToNextSet()
    } else {
      setPendingNextSet(true)
    }
  }

  const moveToNextSet = () => {
    if (!workout || !workout.exercises) {
      console.error("Cannot move to next set: workout data is not fully loaded")
      return
    }

    const currentExercise = workout.exercises[currentExerciseIndex]

    if (!currentExercise || !currentExercise.sets) {
      console.error("Cannot move to next set: current exercise or sets are undefined")
      return
    }

    // Check if there are more sets in the current exercise
    if (currentSetIndex < (workout.exercises[currentExerciseIndex]?.sets?.length || 0) - 1) {
      // Move to next set
      setCurrentSetIndex(currentSetIndex + 1)
      setIsResting(false)
    } else {
      // Check if there are more exercises
      if (currentExerciseIndex < workout.exercises.length - 1) {
        // Move to next exercise, reset set index
        setCurrentExerciseIndex(currentExerciseIndex + 1)
        setCurrentSetIndex(0)
        setIsResting(false)
      } else {
        // Workout complete
        completeWorkout()
      }
    }
  }

  const handleTogglePause = () => {
    if (!isPaused) {
      // Starting a pause - record the time
      setPauseStartTime(Date.now())
    } else if (pauseStartTime) {
      // Ending a pause - calculate and add to total paused time
      const pauseDuration = Math.floor((Date.now() - pauseStartTime) / 1000)
      setTotalPausedTime(totalPausedTime + pauseDuration)
      setPauseStartTime(null)
    }
    setIsPaused(!isPaused)
  }

  const handleSkipRest = () => {
    setRestTimer(0)
    setIsResting(false)

    // If we have pending next set (feedback was completed), move to next set
    if (pendingNextSet) {
      moveToNextSet()
      setPendingNextSet(false)
    }
  }

  const completeWorkout = () => {
    // Stop the workout timer
    if (timerInterval) {
      clearInterval(timerInterval)
    }

    // Calculate final duration, accounting for any active pause
    let finalDuration = workoutDuration
    if (isPaused && pauseStartTime) {
      const currentPauseDuration = Math.floor((Date.now() - pauseStartTime) / 1000)
      finalDuration = workoutDuration
    }

    // Calculate final duration in minutes
    const durationInMinutes = Math.round(finalDuration / 60)

    // Calculate actual workout time (excluding pauses)
    const actualWorkoutTimeSeconds = finalDuration
    const actualWorkoutTimeMinutes = Math.round(actualWorkoutTimeSeconds / 60)

    // Mark workout as completed
    const completedWorkout = {
      ...workout,
      completed: true,
      actualDuration: durationInMinutes,
      totalTimeSeconds: actualWorkoutTimeSeconds,
      totalPausedTimeSeconds: totalPausedTime,
      netWorkoutTimeSeconds: actualWorkoutTimeSeconds - totalPausedTime,
    }

    // Save completed workout to localStorage
    const completedWorkouts = JSON.parse(localStorage.getItem("completedWorkouts") || "[]")
    completedWorkouts.push({
      ...completedWorkout,
      completedDate: new Date().toISOString(),
    })
    localStorage.setItem("completedWorkouts", JSON.stringify(completedWorkouts))

    // Update workout stats
    const stats = JSON.parse(localStorage.getItem("workoutStats") || "{}")
    stats.totalCompleted = (stats.totalCompleted || 0) + 1
    stats.lastWorkoutDate = new Date().toISOString()

    // Use actual tracked time instead of estimate
    stats.totalTime = (stats.totalTime || 0) + actualWorkoutTimeMinutes
    localStorage.setItem("workoutStats", JSON.stringify(stats))

    // Update current week data
    const currentWeekStr = localStorage.getItem("currentWeek")
    const currentWeek = currentWeekStr
      ? JSON.parse(currentWeekStr)
      : {
          weekNumber: getWeekNumber(new Date()),
          completedWorkouts: [],
        }

    currentWeek.completedWorkouts.push(completedWorkout.id || Date.now().toString())
    localStorage.setItem("currentWeek", JSON.stringify(currentWeek))

    setWorkoutComplete(true)
  }

  // Helper function to get week number
  const getWeekNumber = (date: Date) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1)
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
  }

  const handleFinishWorkout = () => {
    router.push("/dashboard")
  }

  // Add a loading state while workout is being generated
  if (!workout) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Loading Workout</CardTitle>
            <CardDescription>Generating your personalized workout...</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center p-6">
            <Loader2 className="h-8 w-8 animate-spin" />
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentExercise = workout?.exercises?.[currentExerciseIndex] || { name: "Loading...", sets: [] }
  const currentSet = currentExercise?.sets?.[currentSetIndex] || { weight: 0, reps: 0, completed: false }
  const progress = workout ? calculateProgress() : 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => router.push("/dashboard/workouts")}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Workouts
        </Button>
        <h1 className="text-xl font-bold">{workout.title}</h1>
        <div className="flex items-center gap-2">
          <Timer className="h-4 w-4" />
          <span className="font-mono">{formatTime(workoutDuration)}</span>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>{workoutComplete ? "Workout Complete!" : workout.title}</CardTitle>
              <CardDescription>{workout.description}</CardDescription>
            </div>
            <div className="text-2xl font-bold">
              {currentExerciseIndex + 1}/{workout.exercises.length}
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </CardHeader>
        <CardContent>
          {workoutComplete ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <div className="rounded-full bg-green-100 dark:bg-green-900 p-3">
                <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-2xl font-bold">Great job!</h2>
              <p className="text-center text-muted-foreground">
                You've completed your workout in {formatTime(workoutDuration)}. Your progress has been saved.
              </p>
              <div className="text-center mt-2">
                <p className="font-medium">Workout Summary:</p>
                <p>Total time: {formatTime(workoutDuration)}</p>
                {totalPausedTime > 0 && (
                  <>
                    <p>Paused time: {formatTime(totalPausedTime)}</p>
                    <p>Active workout time: {formatTime(workoutDuration - totalPausedTime)}</p>
                  </>
                )}
                <p>Exercises completed: {workout.exercises.length}</p>
                <p>
                  Sets completed:{" "}
                  {workout.exercises.reduce((acc, ex) => acc + ex.sets.filter((s) => s.completed).length, 0)}
                </p>
              </div>
              <Button onClick={handleFinishWorkout} className="mt-4">
                Return to Dashboard
              </Button>
            </div>
          ) : isResting ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <h2 className="text-2xl font-bold">Rest Time</h2>
              <div className="text-4xl font-bold">
                {Math.floor(restTimer / 60)}:{restTimer % 60 < 10 ? `0${restTimer % 60}` : restTimer % 60}
              </div>
              <div className="flex space-x-4">
                <Button variant="outline" size="icon" onClick={handleTogglePause}>
                  {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                </Button>
                <Button variant="outline" size="icon" onClick={handleSkipRest}>
                  <SkipForward className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Next: {currentExercise.name} - Set {currentSetIndex + 1}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-col items-center text-center space-y-2">
                <h2 className="text-2xl font-bold">{currentExercise.name}</h2>
                <p className="text-muted-foreground">
                  Set {currentSetIndex + 1} of {currentExercise.sets.length}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Dumbbell className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {currentExercise.equipmentType || getExerciseEquipment(currentExercise.name)}
                  </span>
                </div>
              </div>

              <div className="flex justify-center items-center space-x-8">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Weight</p>
                  <p className="text-2xl font-bold">{currentSet.weight} kg</p>
                  {currentSet.equipmentConfiguration && (
                    <p className="text-xs text-muted-foreground mt-1">{currentSet.equipmentConfiguration}</p>
                  )}
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Reps</p>
                  <p className="text-2xl font-bold">{currentSet.reps}</p>
                </div>
              </div>

              <Tabs defaultValue="current" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="current">Current Exercise</TabsTrigger>
                  <TabsTrigger value="all">All Exercises</TabsTrigger>
                </TabsList>
                <TabsContent value="current" className="space-y-4">
                  <div className="space-y-2 mt-4">
                    {currentExercise.sets.map((set, index) => (
                      <div
                        key={index}
                        className={cn(
                          "flex justify-between items-center p-3 rounded-md",
                          index === currentSetIndex
                            ? "bg-primary/10 border border-primary/20"
                            : set.completed
                              ? "bg-green-100 dark:bg-green-900/20"
                              : "bg-muted",
                        )}
                      >
                        <div className="flex flex-col">
                          <span className="font-medium">Set {index + 1}:</span>
                          <span>
                            {set.weight} kg × {set.reps} reps
                          </span>
                          {set.equipmentConfiguration && (
                            <span className="text-xs text-muted-foreground">{set.equipmentConfiguration}</span>
                          )}
                        </div>
                        {set.completed && <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />}
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="all">
                  <div className="space-y-4 mt-4">
                    {workout.exercises.map((exercise, exIndex) => (
                      <div key={exIndex} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">{exercise.name}</h3>
                          <span className="text-sm text-muted-foreground">
                            {exercise.sets.filter((s) => s.completed).length}/{exercise.sets.length} sets
                          </span>
                        </div>
                        <Progress
                          value={(exercise.sets.filter((s) => s.completed).length / exercise.sets.length) * 100}
                          className="h-1"
                        />
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </CardContent>
        {!workoutComplete && !isResting && (
          <CardFooter className="flex justify-between">
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  if (currentSetIndex > 0) {
                    setCurrentSetIndex(currentSetIndex - 1)
                  } else if (currentExerciseIndex > 0) {
                    setCurrentExerciseIndex(currentExerciseIndex - 1)
                    setCurrentSetIndex(workout.exercises[currentExerciseIndex - 1].sets.length - 1)
                  }
                }}
                disabled={currentExerciseIndex === 0 && currentSetIndex === 0}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  if (currentSetIndex < currentExercise.sets.length - 1) {
                    setCurrentSetIndex(currentSetIndex + 1)
                  } else if (currentExerciseIndex < workout.exercises.length - 1) {
                    setCurrentExerciseIndex(currentExerciseIndex + 1)
                    setCurrentSetIndex(0)
                  }
                }}
                disabled={
                  currentExerciseIndex === workout.exercises.length - 1 &&
                  currentSetIndex === currentExercise.sets.length - 1
                }
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
            <Button onClick={handleCompleteSet}>Complete Set</Button>
          </CardFooter>
        )}
      </Card>

      <Dialog open={showFeedback} onOpenChange={setShowFeedback}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>How was that set?</DialogTitle>
            <DialogDescription>Provide feedback to adjust your workout</DialogDescription>
          </DialogHeader>

          {feedbackStep === "type" ? (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 gap-4">
                <Button
                  variant="outline"
                  className="flex justify-between items-center p-4 h-auto"
                  onClick={() => handleFeedbackTypeSelect("weight")}
                >
                  <span className="text-left font-medium">Weight</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="flex justify-between items-center p-4 h-auto"
                  onClick={() => handleFeedbackTypeSelect("reps")}
                >
                  <span className="text-left font-medium">Reps</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="flex justify-between items-center p-4 h-auto"
                  onClick={() => handleFeedbackTypeSelect("rest")}
                >
                  <span className="text-left font-medium">Rest Time</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 py-4">
              <h3 className="font-medium">
                Adjust {feedbackType === "weight" ? "Weight" : feedbackType === "reps" ? "Reps" : "Rest Time"}
              </h3>

              <div className="grid grid-cols-1 gap-4">
                <Button
                  variant="outline"
                  className="flex justify-between items-center p-4 h-auto"
                  onClick={() => handleFeedbackAdjustmentSelect("too_high")}
                >
                  <span className="text-left">
                    {feedbackType === "weight"
                      ? "Too heavy"
                      : feedbackType === "reps"
                        ? "Too many reps"
                        : "Rest time too long"}
                  </span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="flex justify-between items-center p-4 h-auto"
                  onClick={() => handleFeedbackAdjustmentSelect("too_low")}
                >
                  <span className="text-left">
                    {feedbackType === "weight"
                      ? "Too light"
                      : feedbackType === "reps"
                        ? "Too few reps"
                        : "Rest time too short"}
                  </span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              {feedbackAdjustment && (
                <div className="space-y-2 mt-4">
                  {feedbackType === "weight" && (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Weight: {weightFeedback} kg</Label>
                      </div>
                      <Slider
                        value={[weightFeedback]}
                        min={Math.max(0, currentSet.weight - 20)}
                        max={currentSet.weight + 20}
                        step={2.5}
                        onValueChange={(value) => setWeightFeedback(value[0])}
                      />
                    </div>
                  )}

                  {feedbackType === "reps" && (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Reps: {repsFeedback}</Label>
                      </div>
                      <Slider
                        value={[repsFeedback]}
                        min={Math.max(1, currentSet.reps - 6)}
                        max={currentSet.reps + 6}
                        step={1}
                        onValueChange={(value) => setRepsFeedback(value[0])}
                      />
                    </div>
                  )}

                  {feedbackType === "rest" && (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Rest Time: {restFeedback} seconds</Label>
                      </div>
                      <Slider
                        value={[restFeedback]}
                        min={30}
                        max={180}
                        step={15}
                        onValueChange={(value) => setRestFeedback(value[0])}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <DialogFooter className="flex justify-between sm:justify-between">
            <Button
              variant="outline"
              onClick={() => {
                setShowFeedback(false)
                // If rest is already over, move to next set immediately
                if (!isResting || restTimer <= 0) {
                  moveToNextSet()
                } else {
                  setPendingNextSet(true)
                }
              }}
            >
              Skip
            </Button>
            {feedbackStep === "type" ? (
              <Button
                onClick={() => {
                  setShowFeedback(false)
                  // If rest is already over, move to next set immediately
                  if (!isResting || restTimer <= 0) {
                    moveToNextSet()
                  } else {
                    setPendingNextSet(true)
                  }
                }}
              >
                No Changes Needed
              </Button>
            ) : (
              <Button onClick={handleFeedbackSubmit} disabled={!feedbackAdjustment}>
                Apply & Continue
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Show rest timer in the background when feedback dialog is open */}
      {isResting && showFeedback && (
        <div className="fixed bottom-4 right-4 bg-background border rounded-md p-3 shadow-md">
          <div className="flex items-center gap-2">
            <Timer className="h-4 w-4" />
            <span className="font-mono">
              {Math.floor(restTimer / 60)}:{restTimer % 60 < 10 ? `0${restTimer % 60}` : restTimer % 60}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
