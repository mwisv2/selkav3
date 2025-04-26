import { NextResponse } from "next/server"
import { db } from "@/lib/firebase"
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore"

interface WorkoutData {
  userProfile: {
    name: string
    age: number
    weight: number
    height: number
    fitnessLevel: string
    goal: string
    daysPerWeek: number
    minsPerDay: number
    cycleLength: string
    timeFrame: number
    equipment: string[]
    equipmentWeights: {
      [key: string]: number[]
    }
    maxes: {
      squat: string
      bench: string
      deadlift: string
      overhead: string
    }
    experienceLevel: string
    injuries: string[]
  }
  generatedWorkouts: {
    id: string
    title: string
    description: string
    duration: string
    exercises: {
      name: string
      sets: number
      reps: number
      weight?: number
    }[]
    day: string
  }[]
  completedWorkouts: {
    id: string
    completedDate: string
    title: string
    description: string
    duration: string
    exercises: {
      name: string
      sets: number
      reps: number
      weight?: number
    }[]
  }[]
  currentWeek: {
    weekNumber: number
    completedWorkouts: string[]
    workouts: {
      id: string
      title: string
      description: string
      duration: string
      exercises: {
        name: string
        sets: number
        reps: number
        weight?: number
      }[]
    }[]
  }
  onboardingCompleted: boolean
  lastUpdated: string
}

export async function POST(request: Request) {
  try {
    const { key } = await request.json()

    // Query the access-keys collection for the provided key
    const keysRef = collection(db, "access-keys")
    const q = query(keysRef, where("key", "==", key))
    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) {
      return NextResponse.json({ error: "Invalid key" }, { status: 400 })
    }

    const keyDoc = querySnapshot.docs[0]
    const keyData = keyDoc.data()

    // Check if the key is not active (isActive = false means it's available)
    if (keyData.isActive) {
      return NextResponse.json({ error: "Key already in use" }, { status: 400 })
    }

    // Generate a unique identifier for this device
    const hwid = Array.from(crypto.getRandomValues(new Uint8Array(16)))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")

    // Update the key document with the HWID and mark it as active
    await updateDoc(doc(db, "access-keys", keyDoc.id), {
      hwid,
      isActive: true,
      activatedAt: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      hwid,
      currentStep: "step-2",
    })
  } catch (error) {
    console.error("Key verification error:", error)
    return NextResponse.json({ error: "An error occurred during key verification" }, { status: 500 })
  }
}
