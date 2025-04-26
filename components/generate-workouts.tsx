"use client"

// Define types
type Exercise = {
  name: string
  equipment: string[]
  bodyPart: string
  compound: boolean
  experienceLevel?: string[]
  avoidForInjuries?: string[]
}

type Workout = {
  title: string
  description: string
  day: string
  duration: string
  exercises: string[]
}

type UserProfile = {
  daysPerWeek: number
  equipment: string[]
  timePerDay: number
  experienceLevel: string
  injuries: string[]
  equipmentWeights?: { [key: string]: number[] }
  maxes?: { [key: string]: string }
}

// Exercise database
const exerciseDatabase: Exercise[] = [
  // Bodyweight exercises
  {
    name: "Push-ups",
    equipment: ["No Equipment (Bodyweight only)"],
    bodyPart: "chest",
    compound: true,
    experienceLevel: ["beginner", "intermediate", "advanced"],
    avoidForInjuries: ["Shoulder Impingement", "Wrist Pain"],
  },
  {
    name: "Pull-ups",
    equipment: ["Pull-up Bar", "No Equipment (Bodyweight only)"],
    bodyPart: "back",
    compound: true,
    experienceLevel: ["intermediate", "advanced"],
    avoidForInjuries: ["Shoulder Impingement", "Tennis Elbow"],
  },
  {
    name: "Squats",
    equipment: ["No Equipment (Bodyweight only)"],
    bodyPart: "legs",
    compound: true,
    experienceLevel: ["beginner", "intermediate", "advanced"],
    avoidForInjuries: ["Knee Pain"],
  },
  {
    name: "Lunges",
    equipment: ["No Equipment (Bodyweight only)"],
    bodyPart: "legs",
    compound: true,
    experienceLevel: ["beginner", "intermediate", "advanced"],
    avoidForInjuries: ["Knee Pain", "Ankle Sprain"],
  },
  {
    name: "Dips",
    equipment: ["No Equipment (Bodyweight only)"],
    bodyPart: "chest",
    compound: true,
    experienceLevel: ["intermediate", "advanced"],
    avoidForInjuries: ["Shoulder Impingement", "Wrist Pain"],
  },
  {
    name: "Plank",
    equipment: ["No Equipment (Bodyweight only)"],
    bodyPart: "core",
    compound: false,
    experienceLevel: ["beginner", "intermediate", "advanced"],
    avoidForInjuries: ["Lower Back Pain"],
  },
  {
    name: "Mountain Climbers",
    equipment: ["No Equipment (Bodyweight only)"],
    bodyPart: "core",
    compound: false,
    experienceLevel: ["beginner", "intermediate", "advanced"],
    avoidForInjuries: ["Wrist Pain", "Lower Back Pain"],
  },
  {
    name: "Burpees",
    equipment: ["No Equipment (Bodyweight only)"],
    bodyPart: "full",
    compound: true,
    experienceLevel: ["intermediate", "advanced"],
    avoidForInjuries: ["Knee Pain", "Lower Back Pain", "Shoulder Impingement"],
  },

  // Dumbbell exercises
  {
    name: "Dumbbell Bench Press",
    equipment: ["Dumbbells"],
    bodyPart: "chest",
    compound: true,
    experienceLevel: ["beginner", "intermediate", "advanced"],
    avoidForInjuries: ["Shoulder Impingement", "Wrist Pain"],
  },
  {
    name: "Dumbbell Rows",
    equipment: ["Dumbbells"],
    bodyPart: "back",
    compound: true,
    experienceLevel: ["beginner", "intermediate", "advanced"],
    avoidForInjuries: ["Lower Back Pain"],
  },
  {
    name: "Dumbbell Shoulder Press",
    equipment: ["Dumbbells"],
    bodyPart: "shoulders",
    compound: true,
    experienceLevel: ["beginner", "intermediate", "advanced"],
    avoidForInjuries: ["Shoulder Impingement"],
  },
  {
    name: "Dumbbell Lunges",
    equipment: ["Dumbbells"],
    bodyPart: "legs",
    compound: true,
    experienceLevel: ["beginner", "intermediate", "advanced"],
    avoidForInjuries: ["Knee Pain", "Ankle Sprain"],
  },
  {
    name: "Dumbbell Bicep Curls",
    equipment: ["Dumbbells"],
    bodyPart: "arms",
    compound: false,
    experienceLevel: ["beginner", "intermediate", "advanced"],
    avoidForInjuries: ["Tennis Elbow", "Wrist Pain"],
  },
  {
    name: "Dumbbell Tricep Extensions",
    equipment: ["Dumbbells"],
    bodyPart: "arms",
    compound: false,
    experienceLevel: ["beginner", "intermediate", "advanced"],
    avoidForInjuries: ["Tennis Elbow", "Shoulder Impingement"],
  },
  {
    name: "Dumbbell Lateral Raises",
    equipment: ["Dumbbells"],
    bodyPart: "shoulders",
    compound: false,
    experienceLevel: ["beginner", "intermediate", "advanced"],
    avoidForInjuries: ["Shoulder Impingement"],
  },
  {
    name: "Dumbbell Romanian Deadlift",
    equipment: ["Dumbbells"],
    bodyPart: "legs",
    compound: true,
    experienceLevel: ["intermediate", "advanced"],
    avoidForInjuries: ["Lower Back Pain", "Hamstring Strain"],
  },

  // Barbell exercises
  {
    name: "Barbell Bench Press",
    equipment: ["Barbell", "Bench Press"],
    bodyPart: "chest",
    compound: true,
    experienceLevel: ["intermediate", "advanced"],
    avoidForInjuries: ["Shoulder Impingement", "Wrist Pain"],
  },
  {
    name: "Barbell Squat",
    equipment: ["Barbell", "Squat Rack"],
    bodyPart: "legs",
    compound: true,
    experienceLevel: ["intermediate", "advanced"],
    avoidForInjuries: ["Knee Pain", "Lower Back Pain"],
  },
  {
    name: "Barbell Deadlift",
    equipment: ["Barbell"],
    bodyPart: "full",
    compound: true,
    experienceLevel: ["intermediate", "advanced"],
    avoidForInjuries: ["Lower Back Pain", "Hamstring Strain"],
  },
  {
    name: "Barbell Rows",
    equipment: ["Barbell"],
    bodyPart: "back",
    compound: true,
    experienceLevel: ["intermediate", "advanced"],
    avoidForInjuries: ["Lower Back Pain"],
  },
  {
    name: "Barbell Overhead Press",
    equipment: ["Barbell"],
    bodyPart: "shoulders",
    compound: true,
    experienceLevel: ["intermediate", "advanced"],
    avoidForInjuries: ["Shoulder Impingement", "Neck Pain"],
  },
  {
    name: "Barbell Bicep Curls",
    equipment: ["Barbell"],
    bodyPart: "arms",
    compound: false,
    experienceLevel: ["beginner", "intermediate", "advanced"],
    avoidForInjuries: ["Tennis Elbow", "Wrist Pain"],
  },

  // Resistance band exercises
  {
    name: "Resistance Band Chest Press",
    equipment: ["Resistance Bands"],
    bodyPart: "chest",
    compound: false,
    experienceLevel: ["beginner", "intermediate", "advanced"],
    avoidForInjuries: ["Shoulder Impingement"],
  },
  {
    name: "Resistance Band Rows",
    equipment: ["Resistance Bands"],
    bodyPart: "back",
    compound: false,
    experienceLevel: ["beginner", "intermediate", "advanced"],
    avoidForInjuries: [],
  },
  {
    name: "Resistance Band Squats",
    equipment: ["Resistance Bands"],
    bodyPart: "legs",
    compound: true,
    experienceLevel: ["beginner", "intermediate", "advanced"],
    avoidForInjuries: ["Knee Pain"],
  },
  {
    name: "Resistance Band Shoulder Press",
    equipment: ["Resistance Bands"],
    bodyPart: "shoulders",
    compound: false,
    experienceLevel: ["beginner", "intermediate", "advanced"],
    avoidForInjuries: ["Shoulder Impingement"],
  },
  {
    name: "Resistance Band Bicep Curls",
    equipment: ["Resistance Bands"],
    bodyPart: "arms",
    compound: false,
    experienceLevel: ["beginner", "intermediate", "advanced"],
    avoidForInjuries: ["Tennis Elbow"],
  },

  // Kettlebell exercises
  {
    name: "Kettlebell Swings",
    equipment: ["Kettlebells"],
    bodyPart: "full",
    compound: true,
    experienceLevel: ["beginner", "intermediate", "advanced"],
    avoidForInjuries: ["Lower Back Pain", "Shoulder Impingement"],
  },
  {
    name: "Kettlebell Goblet Squats",
    equipment: ["Kettlebells"],
    bodyPart: "legs",
    compound: true,
    experienceLevel: ["beginner", "intermediate", "advanced"],
    avoidForInjuries: ["Knee Pain"],
  },
  {
    name: "Kettlebell Turkish Get-Up",
    equipment: ["Kettlebells"],
    bodyPart: "full",
    compound: true,
    experienceLevel: ["intermediate", "advanced"],
    avoidForInjuries: ["Shoulder Impingement", "Wrist Pain", "Lower Back Pain"],
  },

  // More bodyweight exercises
  {
    name: "Jumping Jacks",
    equipment: ["No Equipment (Bodyweight only)"],
    bodyPart: "full",
    compound: false,
    experienceLevel: ["beginner", "intermediate", "advanced"],
    avoidForInjuries: ["Ankle Sprain", "Knee Pain"],
  },
  {
    name: "Bicycle Crunches",
    equipment: ["No Equipment (Bodyweight only)"],
    bodyPart: "core",
    compound: false,
    experienceLevel: ["beginner", "intermediate", "advanced"],
    avoidForInjuries: ["Lower Back Pain", "Neck Pain"],
  },
  {
    name: "Russian Twists",
    equipment: ["No Equipment (Bodyweight only)"],
    bodyPart: "core",
    compound: false,
    experienceLevel: ["beginner", "intermediate", "advanced"],
    avoidForInjuries: ["Lower Back Pain"],
  },
  {
    name: "Glute Bridges",
    equipment: ["No Equipment (Bodyweight only)"],
    bodyPart: "legs",
    compound: false,
    experienceLevel: ["beginner", "intermediate", "advanced"],
    avoidForInjuries: ["Lower Back Pain"],
  },
  {
    name: "Superman",
    equipment: ["No Equipment (Bodyweight only)"],
    bodyPart: "back",
    compound: false,
    experienceLevel: ["beginner", "intermediate", "advanced"],
    avoidForInjuries: ["Lower Back Pain"],
  },
  {
    name: "Pike Push-ups",
    equipment: ["No Equipment (Bodyweight only)"],
    bodyPart: "shoulders",
    compound: true,
    experienceLevel: ["intermediate", "advanced"],
    avoidForInjuries: ["Shoulder Impingement", "Wrist Pain"],
  },
  {
    name: "Diamond Push-ups",
    equipment: ["No Equipment (Bodyweight only)"],
    bodyPart: "triceps",
    compound: false,
    experienceLevel: ["intermediate", "advanced"],
    avoidForInjuries: ["Shoulder Impingement", "Wrist Pain"],
  },
  {
    name: "Inverted Rows",
    equipment: ["No Equipment (Bodyweight only)"],
    bodyPart: "back",
    compound: true,
    experienceLevel: ["beginner", "intermediate", "advanced"],
    avoidForInjuries: [],
  },

  // More dumbbell exercises
  {
    name: "Dumbbell Flyes",
    equipment: ["Dumbbells"],
    bodyPart: "chest",
    compound: false,
    experienceLevel: ["intermediate", "advanced"],
    avoidForInjuries: ["Shoulder Impingement"],
  },
  {
    name: "Dumbbell Pullovers",
    equipment: ["Dumbbells"],
    bodyPart: "chest",
    compound: false,
    experienceLevel: ["intermediate", "advanced"],
    avoidForInjuries: ["Shoulder Impingement", "Lower Back Pain"],
  },
  {
    name: "Dumbbell Shrugs",
    equipment: ["Dumbbells"],
    bodyPart: "shoulders",
    compound: false,
    experienceLevel: ["beginner", "intermediate", "advanced"],
    avoidForInjuries: ["Neck Pain"],
  },
  {
    name: "Dumbbell Front Raises",
    equipment: ["Dumbbells"],
    bodyPart: "shoulders",
    compound: false,
    experienceLevel: ["beginner", "intermediate", "advanced"],
    avoidForInjuries: ["Shoulder Impingement"],
  },
  {
    name: "Dumbbell Hammer Curls",
    equipment: ["Dumbbells"],
    bodyPart: "arms",
    compound: false,
    experienceLevel: ["beginner", "intermediate", "advanced"],
    avoidForInjuries: ["Tennis Elbow"],
  },
  {
    name: "Dumbbell Skull Crushers",
    equipment: ["Dumbbells"],
    bodyPart: "arms",
    compound: false,
    experienceLevel: ["intermediate", "advanced"],
    avoidForInjuries: ["Tennis Elbow", "Shoulder Impingement"],
  },
  {
    name: "Dumbbell Goblet Squats",
    equipment: ["Dumbbells"],
    bodyPart: "legs",
    compound: true,
    experienceLevel: ["beginner", "intermediate", "advanced"],
    avoidForInjuries: ["Knee Pain"],
  },
  {
    name: "Dumbbell Step-ups",
    equipment: ["Dumbbells"],
    bodyPart: "legs",
    compound: true,
    experienceLevel: ["beginner", "intermediate", "advanced"],
    avoidForInjuries: ["Knee Pain", "Ankle Sprain"],
  },

  // More resistance band exercises
  {
    name: "Resistance Band Pull-aparts",
    equipment: ["Resistance Bands"],
    bodyPart: "back",
    compound: false,
    experienceLevel: ["beginner", "intermediate", "advanced"],
    avoidForInjuries: [],
  },
  {
    name: "Resistance Band Face Pulls",
    equipment: ["Resistance Bands"],
    bodyPart: "shoulders",
    compound: false,
    experienceLevel: ["beginner", "intermediate", "advanced"],
    avoidForInjuries: [],
  },
  {
    name: "Resistance Band Tricep Pushdowns",
    equipment: ["Resistance Bands"],
    bodyPart: "arms",
    compound: false,
    experienceLevel: ["beginner", "intermediate", "advanced"],
    avoidForInjuries: ["Tennis Elbow"],
  },
  {
    name: "Resistance Band Lateral Walks",
    equipment: ["Resistance Bands"],
    bodyPart: "legs",
    compound: false,
    experienceLevel: ["beginner", "intermediate", "advanced"],
    avoidForInjuries: ["Hip Flexor Strain"],
  },
  {
    name: "Resistance Band Good Mornings",
    equipment: ["Resistance Bands"],
    bodyPart: "legs",
    compound: true,
    experienceLevel: ["beginner", "intermediate", "advanced"],
    avoidForInjuries: ["Lower Back Pain", "Hamstring Strain"],
  },
  {
    name: "Resistance Band Overhead Press",
    equipment: ["Resistance Bands"],
    bodyPart: "shoulders",
    compound: true,
    experienceLevel: ["beginner", "intermediate", "advanced"],
    avoidForInjuries: ["Shoulder Impingement"],
  },

  // New Cable Machine Exercises
  {
    name: "Cable Chest Fly",
    equipment: ["Cable Machine"],
    bodyPart: "chest",
    compound: false,
    experienceLevel: ["intermediate", "advanced"],
    avoidForInjuries: ["Shoulder Impingement"],
  },
  {
    name: "Cable Lat Pulldown",
    equipment: ["Cable Machine"],
    bodyPart: "back",
    compound: true,
    experienceLevel: ["beginner", "intermediate", "advanced"],
    avoidForInjuries: [],
  },
  {
    name: "Cable Seated Row",
    equipment: ["Cable Machine"],
    bodyPart: "back",
    compound: true,
    experienceLevel: ["beginner", "intermediate", "advanced"],
    avoidForInjuries: [],
  },
  {
    name: "Cable Shoulder Press",
    equipment: ["Cable Machine"],
    bodyPart: "shoulders",
    compound: true,
    experienceLevel: ["beginner", "intermediate", "advanced"],
    avoidForInjuries: ["Shoulder Impingement"],
  },
  {
    name: "Cable Bicep Curl",
    equipment: ["Cable Machine"],
    bodyPart: "arms",
    compound: false,
    experienceLevel: ["beginner", "intermediate", "advanced"],
    avoidForInjuries: ["Tennis Elbow"],
  },
  {
    name: "Cable Tricep Pushdown",
    equipment: ["Cable Machine"],
    bodyPart: "arms",
    compound: false,
    experienceLevel: ["beginner", "intermediate", "advanced"],
    avoidForInjuries: ["Tennis Elbow"],
  },
  {
    name: "Cable Face Pull",
    equipment: ["Cable Machine"],
    bodyPart: "shoulders",
    compound: false,
    experienceLevel: ["intermediate", "advanced"],
    avoidForInjuries: [],
  },
  {
    name: "Cable Woodchopper",
    equipment: ["Cable Machine"],
    bodyPart: "core",
    compound: true,
    experienceLevel: ["intermediate", "advanced"],
    avoidForInjuries: ["Lower Back Pain"],
  },
  {
    name: "Cable Lateral Raise",
    equipment: ["Cable Machine"],
    bodyPart: "shoulders",
    compound: false,
    experienceLevel: ["beginner", "intermediate", "advanced"],
    avoidForInjuries: ["Shoulder Impingement"],
  },
  {
    name: "Cable Romanian Deadlift",
    equipment: ["Cable Machine"],
    bodyPart: "legs",
    compound: true,
    experienceLevel: ["intermediate", "advanced"],
    avoidForInjuries: ["Lower Back Pain", "Hamstring Strain"],
  },
  {
    name: "Cable Squat",
    equipment: ["Cable Machine"],
    bodyPart: "legs",
    compound: true,
    experienceLevel: ["beginner", "intermediate", "advanced"],
    avoidForInjuries: ["Knee Pain"],
  },
  {
    name: "Cable Glute Kickback",
    equipment: ["Cable Machine"],
    bodyPart: "legs",
    compound: false,
    experienceLevel: ["beginner", "intermediate", "advanced"],
    avoidForInjuries: ["Hip Flexor Strain"],
  },

  // Treadmill Exercises
  {
    name: "Treadmill Walk",
    equipment: ["Treadmill"],
    bodyPart: "full",
    compound: true,
    experienceLevel: ["beginner", "intermediate", "advanced"],
    avoidForInjuries: [],
  },
  {
    name: "Treadmill Jog",
    equipment: ["Treadmill"],
    bodyPart: "full",
    compound: true,
    experienceLevel: ["beginner", "intermediate", "advanced"],
    avoidForInjuries: ["Knee Pain", "Ankle Sprain"],
  },
  {
    name: "Treadmill Run",
    equipment: ["Treadmill"],
    bodyPart: "full",
    compound: true,
    experienceLevel: ["beginner", "intermediate", "advanced"],
    avoidForInjuries: ["Knee Pain", "Ankle Sprain", "Hip Flexor Strain"],
  },
  {
    name: "Treadmill Sprint Intervals",
    equipment: ["Treadmill"],
    bodyPart: "full",
    compound: true,
    experienceLevel: ["advanced"],
    avoidForInjuries: ["Knee Pain", "Ankle Sprain", "Hip Flexor Strain", "Lower Back Pain"],
  },
  {
    name: "Treadmill Incline Walk",
    equipment: ["Treadmill"],
    bodyPart: "full",
    compound: true,
    experienceLevel: ["beginner", "intermediate", "advanced"],
    avoidForInjuries: ["Lower Back Pain"],
  },
  {
    name: "Treadmill Hill Sprints",
    equipment: ["Treadmill"],
    bodyPart: "full",
    compound: true,
    experienceLevel: ["advanced"],
    avoidForInjuries: ["Knee Pain", "Ankle Sprain", "Hip Flexor Strain", "Lower Back Pain"],
  },

  // Elliptical Exercises
  {
    name: "Elliptical Steady-State",
    equipment: ["Elliptical"],
    bodyPart: "full",
    compound: true,
    experienceLevel: ["beginner", "intermediate", "advanced"],
    avoidForInjuries: [],
  },
  {
    name: "Elliptical Interval Training",
    equipment: ["Elliptical"],
    bodyPart: "full",
    compound: true,
    experienceLevel: ["intermediate", "advanced"],
    avoidForInjuries: [],
  },
  {
    name: "Elliptical Reverse Motion",
    equipment: ["Elliptical"],
    bodyPart: "full",
    compound: true,
    experienceLevel: ["intermediate", "advanced"],
    avoidForInjuries: [],
  },
  {
    name: "Elliptical Hill Climb",
    equipment: ["Elliptical"],
    bodyPart: "full",
    compound: true,
    experienceLevel: ["intermediate", "advanced"],
    avoidForInjuries: [],
  },
  {
    name: "Elliptical High Resistance",
    equipment: ["Elliptical"],
    bodyPart: "full",
    compound: true,
    experienceLevel: ["advanced"],
    avoidForInjuries: [],
  },
]

export function generateWorkouts(userProfile: any): Workout[] {
  // Safety check - if no user profile provided, use default values
  if (!userProfile) {
    console.warn("No user profile provided to generateWorkouts")
    userProfile = {
      daysPerWeek: 3,
      equipment: ["No Equipment (Bodyweight only)"],
      timePerDay: 45,
      experienceLevel: "beginner",
      injuries: [],
    }
  }
  // Generate workouts based on user equipment and preferences
  const daysPerWeek = Number.parseInt(userProfile.daysPerWeek || "3")
  const userEquipment = userProfile.equipment || ["No Equipment (Bodyweight only)"]
  const timePerDay = Number.parseInt(userProfile.timePerDay || "45")
  const userExperience = userProfile.experienceLevel || "beginner"
  const userInjuries = userProfile.injuries || []

  // Filter exercises based on available equipment, experience level, and injuries
  const availableExercises = exerciseDatabase.filter((exercise) => {
    // Check if ALL equipment required for this exercise is available to the user
    const hasRequiredEquipment = exercise.equipment.every((requiredEquipment) =>
      userEquipment.includes(requiredEquipment),
    )

    // Check if exercise is appropriate for user's experience level
    const isAppropriateLevel = !exercise.experienceLevel || exercise.experienceLevel.includes(userExperience)

    // Check if exercise should be avoided due to injuries
    const shouldAvoid =
      exercise.avoidForInjuries && userInjuries.some((injury) => exercise.avoidForInjuries?.includes(injury))

    return hasRequiredEquipment && isAppropriateLevel && !shouldAvoid
  })

  // If no exercises match (or very few), ensure we at least include bodyweight exercises
  if (availableExercises.length < 3 && !userEquipment.includes("No Equipment (Bodyweight only)")) {
    const bodyweightExercises = exerciseDatabase.filter(
      (exercise) =>
        exercise.equipment.includes("No Equipment (Bodyweight only)") &&
        (!exercise.experienceLevel || exercise.experienceLevel.includes(userExperience)) &&
        !userInjuries.some((injury) => exercise.avoidForInjuries?.includes(injury)),
    )
    return generateWorkoutsFromExercises([...availableExercises, ...bodyweightExercises], userProfile)
  }

  return generateWorkoutsFromExercises(availableExercises, userProfile)
}

function generateWorkoutsFromExercises(availableExercises: Exercise[], userProfile: any): Workout[] {
  const daysPerWeek = Number.parseInt(userProfile.daysPerWeek || "3")
  const timePerDay = Number.parseInt(userProfile.timePerDay || "45")

  // Ensure minimum time per day is 30 minutes
  const adjustedTimePerDay = Math.max(timePerDay, 30)

  // Determine number of exercises per workout based on time
  const exercisesPerWorkout =
    adjustedTimePerDay <= 30 ? 4 : adjustedTimePerDay <= 45 ? 5 : adjustedTimePerDay <= 60 ? 6 : 7

  // Create workout split based on days per week
  let workoutSplit: string[][] = []

  if (daysPerWeek === 1) {
    workoutSplit = [["full"]] // Full body
  } else if (daysPerWeek === 2) {
    workoutSplit = [["upper"], ["lower"]] // Upper/Lower
  } else if (daysPerWeek === 3) {
    workoutSplit = [["push"], ["pull"], ["legs"]] // Push/Pull/Legs
  } else if (daysPerWeek === 4) {
    workoutSplit = [["chest", "triceps"], ["back", "biceps"], ["shoulders", "core"], ["legs"]] // 4-day split
  } else if (daysPerWeek === 5) {
    workoutSplit = [["chest"], ["back"], ["shoulders"], ["arms"], ["legs"]] // 5-day split
  } else if (daysPerWeek >= 6) {
    workoutSplit = [["chest"], ["back"], ["shoulders"], ["arms"], ["legs"], ["core"]] // 6-day split
  }

  // Ensure we only have as many days as user requested
  workoutSplit = workoutSplit.slice(0, daysPerWeek)

  // Generate workouts for each day
  const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  const workouts: Workout[] = []

  workoutSplit.forEach((bodyParts, index) => {
    const workoutTitle = getWorkoutTitle(bodyParts)
    const description = getWorkoutDescription(bodyParts)
    const day = weekdays[index]
    const duration = `${timePerDay} min`

    // Select exercises for this workout
    const workoutExercises = selectExercisesForBodyParts(bodyParts, availableExercises, exercisesPerWorkout)

    workouts.push({
      title: workoutTitle,
      description,
      day,
      duration,
      exercises: workoutExercises,
    })
  })

  return workouts
}

function getWorkoutTitle(bodyParts: string[]): string {
  if (bodyParts.includes("full")) return "Full Body"
  if (bodyParts.includes("upper")) return "Upper Body"
  if (bodyParts.includes("lower")) return "Lower Body"
  if (bodyParts.includes("push")) return "Push Day"
  if (bodyParts.includes("pull")) return "Pull Day"
  if (bodyParts.includes("legs")) return "Leg Day"

  // For other combinations
  return bodyParts.map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" & ")
}

function getWorkoutDescription(bodyParts: string[]): string {
  if (bodyParts.includes("full")) return "Complete full body workout"
  if (bodyParts.includes("upper")) return "Upper body strength and muscle building"
  if (bodyParts.includes("lower")) return "Lower body strength and development"
  if (bodyParts.includes("push")) return "Chest, shoulders, and triceps"
  if (bodyParts.includes("pull")) return "Back and biceps"
  if (bodyParts.includes("legs")) return "Quads, hamstrings, and calves"

  // For specific body parts
  const bodyPartDescriptions: { [key: string]: string } = {
    chest: "Chest development and strength",
    back: "Back thickness and width",
    shoulders: "Shoulder development and stability",
    arms: "Biceps and triceps",
    legs: "Leg strength and muscle building",
    core: "Core strength and stability",
    triceps: "Triceps isolation and development",
    biceps: "Biceps isolation and development",
  }

  const descriptions = bodyParts.map((part) => bodyPartDescriptions[part] || part)
  return descriptions.join(", ")
}

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

const filterExercisesByEquipment = (exercises: Exercise[], equipment: string[]): Exercise[] => {
  // Always include bodyweight exercises
  const bodyweightExercises = exercises.filter(
    (ex) => Array.isArray(ex.equipment) && ex.equipment.includes("No Equipment (Bodyweight only)"),
  )

  // Filter equipment-based exercises
  const equipmentExercises = exercises.filter(
    (ex) =>
      Array.isArray(ex.equipment) &&
      ex.equipment.some((eq) => equipment.includes(eq)) &&
      !ex.equipment.includes("No Equipment (Bodyweight only)"),
  )

  // Combine both sets of exercises
  return [...bodyweightExercises, ...equipmentExercises]
}

const selectExercisesForBodyParts = (bodyParts: string[], availableExercises: Exercise[], count: number): string[] => {
  // First, try to get exercises for the target body parts
  let targetExercises = availableExercises.filter((ex) => bodyParts.includes(ex.bodyPart))

  // If we don't have enough exercises for the target body parts, include exercises for related body parts
  if (targetExercises.length < count) {
    // Get all body parts
    const allBodyParts = ["chest", "back", "shoulders", "arms", "legs", "core", "full"]

    // Add exercises from other body parts
    const otherExercises = availableExercises.filter((ex) => !bodyParts.includes(ex.bodyPart))

    targetExercises = [...targetExercises, ...otherExercises]
  }

  // If we still don't have enough exercises, duplicate some
  if (targetExercises.length < count) {
    while (targetExercises.length < count) {
      // Add exercises from the beginning of the array
      targetExercises = [...targetExercises, ...targetExercises.slice(0, count - targetExercises.length)]
    }
  }

  // Shuffle and return the exercises
  return shuffleArray(targetExercises)
    .slice(0, count)
    .map((ex) => ex.name)
}

function flattenBodyParts(bodyParts: string[]): string[] {
  const mapping: { [key: string]: string[] } = {
    full: ["chest", "back", "shoulders", "arms", "legs", "core"],
    upper: ["chest", "back", "shoulders", "arms"],
    lower: ["legs"],
    push: ["chest", "shoulders", "triceps"],
    pull: ["back", "biceps"],
    legs: ["legs"],
    arms: ["biceps", "triceps"],
  }

  let flattened: string[] = []

  bodyParts.forEach((part) => {
    if (mapping[part]) {
      flattened = [...flattened, ...mapping[part]]
    } else {
      flattened.push(part)
    }
  })

  return [...new Set(flattened)] // Remove duplicates
}

// Add this function to calculate plate configuration
function calculatePlateConfiguration(
  targetWeight: number,
  availablePlates: number[],
  barbellWeight: number,
): { plates: { weight: number; count: number }[]; possible: boolean } {
  // Sort plates in descending order
  const sortedPlates = [...availablePlates].sort((a, b) => b - a)

  // Calculate how much weight we need to add with plates
  const remainingWeight = targetWeight - barbellWeight

  // If remaining weight is negative or zero, we don't need plates
  if (remainingWeight <= 0) {
    return { plates: [], possible: true }
  }

  // We need to add weight in pairs, so each plate is counted twice
  const weightPerSide = remainingWeight / 2

  // Keep track of plates we use
  const usedPlates: { weight: number; count: number }[] = []
  let remainingWeightPerSide = weightPerSide

  // Greedy algorithm to select plates
  for (const plate of sortedPlates) {
    if (plate <= remainingWeightPerSide) {
      // How many pairs of this plate can we use?
      const pairsCount = Math.floor(remainingWeightPerSide / plate)
      usedPlates.push({ weight: plate, count: pairsCount * 2 }) // Count * 2 because we need pairs
      remainingWeightPerSide -= pairsCount * plate
    }
  }

  // Check if we were able to reach the exact weight
  const possible = remainingWeightPerSide === 0

  return { plates: usedPlates, possible }
}

// Update the getWorkoutsWithSets function to include plate configuration
export function getWorkoutsWithSets(workouts: Workout[], userProfile: UserProfile): any[] {
  // Safety check - if no workouts provided, return empty array
  if (!workouts || !Array.isArray(workouts) || workouts.length === 0) {
    console.warn("No workouts provided to getWorkoutsWithSets")
    return []
  }

  // Safety check - if no user profile provided, use empty object
  userProfile = userProfile || {}
  // Get barbell weight if available
  const equipmentWeights = userProfile.equipmentWeights || {}
  const barbellWeight =
    equipmentWeights["Barbell"] && equipmentWeights["Barbell"].length > 0 ? equipmentWeights["Barbell"][0] : 20 // Default to 20kg if not specified

  // Get available plates if any
  const availablePlates = equipmentWeights["Weight Plates"] || []

  return workouts.map((workout) => {
    const exercises = workout.exercises.map((exerciseName) => {
      // Determine number of sets based on exercise and workout type
      const setCount = 4 // Default to 4 sets

      // Get exercise details
      const exerciseDetails = exerciseDatabase.find((ex) => ex.name === exerciseName)
      const isCompound = exerciseDetails?.compound || false

      // Get user's 1RM if available

      const userMaxes = userProfile.maxes || {}
      let baseWeight = 0

      // Try to match exercise with user's 1RM
      if (exerciseName.includes("Bench Press") && userMaxes.bench) {
        baseWeight = Number.parseInt(userMaxes.bench)
      } else if (exerciseName.includes("Squat") && userMaxes.squat) {
        baseWeight = Number.parseInt(userMaxes.squat)
      } else if (exerciseName.includes("Deadlift") && userMaxes.deadlift) {
        baseWeight = Number.parseInt(userMaxes.deadlift)
      } else if (
        (exerciseName.includes("Overhead Press") || exerciseName.includes("Shoulder Press")) &&
        userMaxes.overhead
      ) {
        baseWeight = Number.parseInt(userMaxes.overhead)
      } else {
        // Estimate based on equipment type
        if (exerciseDetails?.equipment.includes("Barbell")) {
          baseWeight = isCompound ? 60 : 30
        } else if (exerciseDetails?.equipment.includes("Dumbbells")) {
          baseWeight = isCompound ? 20 : 10
        } else if (exerciseDetails?.equipment.includes("Kettlebells")) {
          baseWeight = 16
        } else {
          baseWeight = 0 // Bodyweight or bands
        }
      }

      // Check if user has specified equipment weights
      const equipmentType = exerciseDetails?.equipment.find((e) =>
        ["Dumbbells", "Kettlebells", "Barbell", "Weight Plates"].includes(e),
      )

      // Create sets with appropriate weight and reps
      const sets = Array(setCount)
        .fill(0)
        .map((_, index) => {
          let weight = 0
          let reps = 0

          if (isCompound) {
            // Compound exercises: 70-85% of 1RM
            const percentages = [0.7, 0.75, 0.8, 0.75] // Percentage of 1RM for each set
            weight = Math.round(baseWeight * percentages[index])
            reps = [12, 10, 8, 10][index] // Rep scheme for compound exercises
          } else {
            // Isolation exercises: lighter weight, higher reps
            const percentages = [0.6, 0.65, 0.65, 0.6] // Percentage of 1RM for each set
            weight = Math.round(baseWeight * percentages[index])
            reps = [15, 12, 12, 15][index] // Rep scheme for isolation exercises
          }

          // If user has specified equipment weights, find closest available weight
          let equipmentConfiguration = ""

          if (equipmentType === "Barbell" && availablePlates.length > 0) {
            // For barbell exercises, calculate plate configuration
            const { plates, possible } = calculatePlateConfiguration(weight, availablePlates, barbellWeight)

            if (possible) {
              equipmentConfiguration = `${barbellWeight}kg barbell`
              if (plates.length > 0) {
                equipmentConfiguration += " + "
                equipmentConfiguration += plates.map((p) => `${p.count} × ${p.weight}kg plates`).join(" + ")
              }
            } else {
              // If exact weight not possible, find closest possible weight
              let closestWeight = barbellWeight
              let minDiff = Math.abs(weight - barbellWeight)

              // Try different combinations by incrementally removing weight
              for (let testWeight = weight - 1; testWeight > barbellWeight; testWeight--) {
                const testConfig = calculatePlateConfiguration(testWeight, availablePlates, barbellWeight)
                if (testConfig.possible) {
                  closestWeight = testWeight
                  minDiff = Math.abs(weight - testWeight)
                  break
                }
              }

              // If we couldn't find a lower weight, try higher weights
              if (closestWeight === barbellWeight) {
                for (let testWeight = weight + 1; testWeight <= weight + 20; testWeight++) {
                  const testConfig = calculatePlateConfiguration(testWeight, availablePlates, barbellWeight)
                  if (testConfig.possible) {
                    closestWeight = testWeight
                    minDiff = Math.abs(weight - testWeight)
                    break
                  }
                }
              }

              // Use the closest possible weight
              weight = closestWeight
              const { plates } = calculatePlateConfiguration(weight, availablePlates, barbellWeight)

              equipmentConfiguration = `${barbellWeight}kg barbell`
              if (plates.length > 0) {
                equipmentConfiguration += " + "
                equipmentConfiguration += plates.map((p) => `${p.count} × ${p.weight}kg plates`).join(" + ")
              }
            }
          } else if (
            equipmentType &&
            equipmentWeights &&
            equipmentWeights[equipmentType] &&
            equipmentWeights[equipmentType].length > 0
          ) {
            const availableWeights = equipmentWeights[equipmentType].sort((a, b) => a - b)

            // Find the closest available weight
            let closestWeight = availableWeights[0]
            let minDiff = Math.abs(weight - availableWeights[0])

            for (let i = 1; i < availableWeights.length; i++) {
              const diff = Math.abs(weight - availableWeights[i])
              if (diff < minDiff) {
                minDiff = diff
                closestWeight = availableWeights[i]
              }
            }

            weight = closestWeight

            // Add equipment configuration description
            if (equipmentType === "Dumbbells") {
              equipmentConfiguration = `${weight}kg dumbbells (pair)`
            } else if (equipmentType === "Kettlebells") {
              equipmentConfiguration = `${weight}kg kettlebell`
            }
          }
          // Ensure appropriate weights based on equipment type
          else if (exerciseDetails) {
            if (exerciseDetails.equipment.includes("Barbell") && weight < 20) {
              // Standard barbell weighs 20kg
              weight = 20
              equipmentConfiguration = `${weight}kg barbell`
            } else if (exerciseDetails.equipment.includes("Dumbbells") && weight < 2) {
              // Minimum dumbbell weight
              weight = 2
              equipmentConfiguration = `${weight}kg dumbbells (pair)`
            } else if (exerciseDetails.equipment.includes("Kettlebells") && weight < 4) {
              // Minimum kettlebell weight
              weight = 4
              equipmentConfiguration = `${weight}kg kettlebell`
            } else if (exerciseDetails.equipment.includes("No Equipment (Bodyweight only)")) {
              // For bodyweight exercises, use 0 weight
              weight = 0
              equipmentConfiguration = "Bodyweight"
            }
          }

          return {
            weight,
            reps,
            completed: false,
            equipmentConfiguration: equipmentConfiguration || `${weight}kg`,
          }
        })

      return {
        name: exerciseName,
        sets,
        restTime: isCompound ? 90 : 60, // Default rest time in seconds
      }
    })

    return {
      ...workout,
      exercises,
      completed: false,
    }
  })
}

const calculateWorkoutDuration = (exercises: Exercise[], restTime: number) => {
  let totalDuration = 0

  exercises.forEach((exercise, index) => {
    // Add exercise duration
    totalDuration += exercise.sets * exercise.reps * 3 // 3 seconds per rep

    // Add rest time between sets
    if (exercise.sets > 1) {
      totalDuration += (exercise.sets - 1) * restTime
    }

    // Add rest time between exercises (except for last exercise)
    if (index < exercises.length - 1) {
      totalDuration += restTime
    }
  })

  return Math.ceil(totalDuration / 60) // Convert to minutes
}

const generateWorkout = (day: number, userProfile: UserProfile) => {
  const { equipment, timePerDay } = userProfile
  const exercises = selectExercisesForBodyParts(day, equipment)
  const restTime = 60 // 60 seconds rest between sets

  // Calculate workout duration
  const duration = calculateWorkoutDuration(exercises, restTime)

  // Adjust sets if duration exceeds timePerDay
  const adjustedExercises = [...exercises]
  while (duration > timePerDay && adjustedExercises.length > 0) {
    adjustedExercises.pop()
  }

  return {
    day,
    exercises: adjustedExercises,
    duration: calculateWorkoutDuration(adjustedExercises, restTime),
    restTime,
  }
}
