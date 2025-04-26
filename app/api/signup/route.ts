import { NextResponse } from "next/server"
import { db } from "@/lib/firebase"
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore"

// Simple function to generate a unique identifier
function generateUniqueId() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

export async function POST(request: Request) {
  try {
    const { key } = await request.json()

    if (!key) {
      return NextResponse.json({ success: false, message: "Key is required" }, { status: 400 })
    }

    console.log("Processing signup for key:", key)

    // Query the access-keys collection for the provided key
    const accessKeysRef = collection(db, "access-keys")
    const q = query(accessKeysRef, where("key", "==", key))
    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) {
      console.log("Key not found:", key)
      return NextResponse.json({ success: false, message: "Invalid key" }, { status: 400 })
    }

    const keyDoc = querySnapshot.docs[0]
    const keyData = keyDoc.data()

    console.log("Key found:", key, "isActive:", keyData.isActive)

    // Check if the key is already used
    if (keyData.isActive === false) {
      console.log("Key already in use:", key)
      return NextResponse.json({ success: false, message: "Key is already in use" }, { status: 400 })
    }

    // Generate HWID
    const hwid = generateUniqueId()

    // Create initial workout data structure
    const workoutData = {
      userProfile: {
        name: "",
        age: 0,
        weight: 0,
        height: 0,
        fitnessLevel: "beginner",
        goal: "",
        daysPerWeek: 3,
        minsPerDay: 45,
        cycleLength: "1",
        timeFrame: 0,
        equipment: ["No Equipment (Bodyweight only)"],
        equipmentWeights: {},
        maxes: {
          squat: "0",
          bench: "0",
          deadlift: "0",
          overhead: "0",
        },
        experienceLevel: "beginner",
        injuries: [],
      },
      generatedWorkouts: [],
      completedWorkouts: [],
      currentWeek: {
        weekNumber: 1,
        completedWorkouts: [],
        workouts: [],
      },
      onboardingCompleted: false,
      step1Completed: true, // Mark as completed since we're activating the key
      step2Completed: false,
      step3Completed: false,
      step3bCompleted: false,
      step4Completed: false,
      step5Completed: false,
      step6Completed: false,
      step7Completed: false,
      step8Completed: false,
      step9Completed: false,
      step10Completed: false,
      step10bCompleted: false,
      step11Completed: false,
      step12Completed: false,
      step13Completed: false,
      workoutStats: {
        totalWorkouts: 0,
        totalDuration: 0,
        caloriesBurned: 0,
        lastWorkoutDate: null,
      },
      lastUpdated: new Date().toISOString(),
    }

    // Update the key document with HWID and deactivate it
    await updateDoc(doc(db, "access-keys", keyDoc.id), {
      hwid,
      isActive: false,
      lastUsed: new Date().toISOString(),
      workoutData,
    })

    console.log("Key activated successfully:", key, "with HWID:", hwid)

    // Return success with the key data
    return NextResponse.json({
      success: true,
      message: "Key activated successfully",
      data: {
        key,
        hwid,
        workoutData,
        currentStep: "step-2", // Direct to step-2 since step-1 is complete
      },
    })
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ success: false, message: "An error occurred during signup" }, { status: 500 })
  }
}
