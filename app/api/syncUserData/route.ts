import { NextResponse } from "next/server"
import { db } from "@/lib/firebase"
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore"

export async function POST(request: Request) {
  try {
    const { key, hwid, userData } = await request.json()

    if (!key || !hwid || !userData) {
      console.error("Missing required fields:", { key: !!key, hwid: !!hwid, userData: !!userData })
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 })
    }

    console.log("Received sync request for key:", key, "hwid:", hwid)

    // Query Firestore for the key
    const keysRef = collection(db, "access-keys")
    const q = query(keysRef, where("key", "==", key))
    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) {
      console.error("Invalid access key:", key)
      return NextResponse.json({ success: false, message: "Invalid access key" }, { status: 401 })
    }

    const keyDoc = querySnapshot.docs[0]
    const keyData = keyDoc.data()

    console.log("Found key data, stored HWID:", keyData.hwid, "received HWID:", hwid)

    // Verify HWID matches
    if (keyData.hwid !== hwid) {
      console.error("HWID mismatch. Stored:", keyData.hwid, "Received:", hwid)
      return NextResponse.json({ success: false, message: "Access denied - HWID mismatch" }, { status: 403 })
    }

    // Update all user data with timestamp
    const updatedData = {
      ...userData,
      lastUpdated: new Date().toISOString(),
    }

    await updateDoc(doc(db, "access-keys", keyDoc.id), {
      workoutData: updatedData,
    })

    console.log("Successfully updated data for key:", key)

    return NextResponse.json({
      success: true,
      message: "User data saved successfully",
      lastUpdated: updatedData.lastUpdated,
    })
  } catch (error) {
    console.error("Error saving user data:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
