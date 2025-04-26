/**
 * Utility functions for syncing user data with the server
 */

// Function to sync all user data to the server
export async function syncUserData(): Promise<boolean> {
  try {
    // Get license data from localStorage
    const licenseDataStr = localStorage.getItem("licenseData")
    if (!licenseDataStr) {
      console.log("No license data found, skipping sync")
      return false
    }

    const licenseData = JSON.parse(licenseDataStr)
    const { key, hwid } = licenseData

    if (!key || !hwid) {
      console.log("Missing key or hwid for data sync, skipping sync")
      return false
    }

    // Collect all user data from localStorage
    const userData = {
      userProfile: JSON.parse(localStorage.getItem("userProfile") || "null"),
      generatedWorkouts: JSON.parse(localStorage.getItem("generatedWorkouts") || "[]"),
      completedWorkouts: JSON.parse(localStorage.getItem("completedWorkouts") || "[]"),
      workoutStats: JSON.parse(localStorage.getItem("workoutStats") || "{}"),
      currentWeek: JSON.parse(localStorage.getItem("currentWeek") || "null"),
      weightData: JSON.parse(localStorage.getItem("weightData") || "[]"),
      calorieData: JSON.parse(localStorage.getItem("calorieData") || "[]"),
      onboardingCompleted: localStorage.getItem("onboardingCompleted") === "true",
      step1Completed: localStorage.getItem("step1Completed") === "true",
      step2Completed: localStorage.getItem("step2Completed") === "true",
      step3Completed: localStorage.getItem("step3Completed") === "true",
      step3bCompleted: localStorage.getItem("step3bCompleted") === "true",
      step4Completed: localStorage.getItem("step4Completed") === "true",
      step5Completed: localStorage.getItem("step5Completed") === "true",
      step6Completed: localStorage.getItem("step6Completed") === "true",
      step7Completed: localStorage.getItem("step7Completed") === "true",
      step8Completed: localStorage.getItem("step8Completed") === "true",
      step9Completed: localStorage.getItem("step9Completed") === "true",
      step10Completed: localStorage.getItem("step10Completed") === "true",
      step10bCompleted: localStorage.getItem("step10bCompleted") === "true",
      step11Completed: localStorage.getItem("step11Completed") === "true",
      step12Completed: localStorage.getItem("step12Completed") === "true",
      step13Completed: localStorage.getItem("step13Completed") === "true",
      lastUpdated: new Date().toISOString(),
    }

    console.log("Syncing data with key:", key, "and hwid:", hwid)

    // Send data to server
    const response = await fetch("/api/saveWorkoutData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        key,
        hwid,
        workoutData: userData,
      }),
    })

    // Log the response status for debugging
    console.log("Sync response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Sync error response:", errorText)
      throw new Error(`Server responded with ${response.status}: ${response.statusText}`)
    }

    const result = await response.json()

    if (result.success) {
      // Update last sync time
      localStorage.setItem("lastDataSync", result.lastUpdated || new Date().toISOString())
      return true
    } else {
      console.error("Data sync failed:", result.message)
      return false
    }
  } catch (error) {
    console.error("Error syncing user data:", error)
    return false
  }
}

// Update the loadUserDataFromServer function to handle more data
export function loadUserDataFromServer(data: any): void {
  if (!data || !data.workoutData) {
    console.error("No workout data received from server")
    return
  }

  const { workoutData } = data

  // Save all data to localStorage
  if (workoutData.userProfile) {
    localStorage.setItem("userProfile", JSON.stringify(workoutData.userProfile))
  }

  if (workoutData.generatedWorkouts) {
    localStorage.setItem("generatedWorkouts", JSON.stringify(workoutData.generatedWorkouts))
  }

  if (workoutData.completedWorkouts) {
    localStorage.setItem("completedWorkouts", JSON.stringify(workoutData.completedWorkouts))
  }

  if (workoutData.workoutStats) {
    localStorage.setItem("workoutStats", JSON.stringify(workoutData.workoutStats))
  }

  if (workoutData.currentWeek) {
    localStorage.setItem("currentWeek", JSON.stringify(workoutData.currentWeek))
  }

  if (workoutData.weightData) {
    localStorage.setItem("weightData", JSON.stringify(workoutData.weightData))
  }

  if (workoutData.calorieData) {
    localStorage.setItem("calorieData", JSON.stringify(workoutData.calorieData))
  }

  // Save onboarding steps completion status
  localStorage.setItem("onboardingCompleted", workoutData.onboardingCompleted ? "true" : "false")
  localStorage.setItem("step1Completed", workoutData.step1Completed ? "true" : "false")
  localStorage.setItem("step2Completed", workoutData.step2Completed ? "true" : "false")
  localStorage.setItem("step3Completed", workoutData.step3Completed ? "true" : "false")
  localStorage.setItem("step3bCompleted", workoutData.step3bCompleted ? "true" : "false")
  localStorage.setItem("step4Completed", workoutData.step4Completed ? "true" : "false")
  localStorage.setItem("step5Completed", workoutData.step5Completed ? "true" : "false")
  localStorage.setItem("step6Completed", workoutData.step6Completed ? "true" : "false")
  localStorage.setItem("step7Completed", workoutData.step7Completed ? "true" : "false")
  localStorage.setItem("step8Completed", workoutData.step8Completed ? "true" : "false")
  localStorage.setItem("step9Completed", workoutData.step9Completed ? "true" : "false")
  localStorage.setItem("step10Completed", workoutData.step10Completed ? "true" : "false")
  localStorage.setItem("step10bCompleted", workoutData.step10bCompleted ? "true" : "false")
  localStorage.setItem("step11Completed", workoutData.step11Completed ? "true" : "false")
  localStorage.setItem("step12Completed", workoutData.step12Completed ? "true" : "false")
  localStorage.setItem("step13Completed", workoutData.step13Completed ? "true" : "false")

  // Save last sync time
  localStorage.setItem("lastDataSync", workoutData.lastUpdated || new Date().toISOString())
}
