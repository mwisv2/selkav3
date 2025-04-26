import { NextResponse } from "next/server"
import { db } from "@/lib/firebase"
import { collection, query, where, getDocs } from "firebase/firestore"

export async function POST(request: Request) {
  try {
    const { key } = await request.json()

    if (!key) {
      return NextResponse.json({ success: false, message: "Key is required" }, { status: 400 })
    }

    // Query the access-keys collection for the provided key
    const accessKeysRef = collection(db, "access-keys")
    const q = query(accessKeysRef, where("key", "==", key))
    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) {
      return NextResponse.json({ success: false, message: "Invalid key" }, { status: 400 })
    }

    const keyDoc = querySnapshot.docs[0]
    const keyData = keyDoc.data()

    // Check if the key is active (should be false for existing users)
    if (keyData.isActive) {
      return NextResponse.json({ success: false, message: "Key not activated" }, { status: 400 })
    }

    // Check if HWID exists
    if (!keyData.hwid) {
      return NextResponse.json({ success: false, message: "Invalid key state" }, { status: 400 })
    }

    // Get the stored HWID
    const storedHwid = keyData.hwid

    // Return success with the key data
    return NextResponse.json({
      success: true,
      message: "Login successful",
      data: {
        key,
        hwid: storedHwid, // Return the stored HWID instead of generating a new one
        workoutData: keyData.workoutData || {},
        currentStep: keyData.workoutData?.step1Completed ? "step-2" : "step-1", // Determine which step to go to
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ success: false, message: "An error occurred during login" }, { status: 500 })
  }
}
