"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WorkoutCard } from "@/components/workout-card"
import { generateWorkouts } from "@/components/generate-workouts"
import { useEffect, useState } from "react"

// Replace the component's content starting from the line after export default function WorkoutsPage() {
export default function WorkoutsPage() {
  const [weeklyWorkouts, setWeeklyWorkouts] = useState<any[]>([])

  // Modify the useEffect hook to ensure weeklyWorkouts is always an array
  useEffect(() => {
    // Load user profile from localStorage
    const profile = localStorage.getItem("userProfile")
    if (profile) {
      try {
        const userProfile = JSON.parse(profile)

        // Check if we already have generated workouts in localStorage
        const storedWorkouts = localStorage.getItem("generatedWorkouts")
        if (storedWorkouts) {
          try {
            const parsedWorkouts = JSON.parse(storedWorkouts)
            if (Array.isArray(parsedWorkouts) && parsedWorkouts.length > 0) {
              setWeeklyWorkouts(parsedWorkouts)
              return
            }
          } catch (e) {
            console.error("Error parsing stored workouts:", e)
            setWeeklyWorkouts([])
          }
        }

        try {
          // Generate workouts based on user profile
          const workouts = generateWorkouts(userProfile)

          // Save the generated workouts to localStorage
          localStorage.setItem("generatedWorkouts", JSON.stringify(workouts))

          setWeeklyWorkouts(workouts || [])
        } catch (e) {
          console.error("Error generating workouts:", e)
          setWeeklyWorkouts([])
        }
      } catch (e) {
        console.error("Error parsing user profile:", e)
        setWeeklyWorkouts([])
      }
    } else {
      setWeeklyWorkouts([])
    }
  }, [])

  // Update the JSX to check if weeklyWorkouts is defined and not empty
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Workouts</h1>
        <p className="text-muted-foreground">Your personalized workout plan based on your goals and preferences.</p>
      </div>

      <Tabs defaultValue="weekly" className="space-y-4">
        <TabsList>
          <TabsTrigger value="weekly">Weekly Plan</TabsTrigger>
          <TabsTrigger value="exercises">Exercise Library</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        <TabsContent value="weekly" className="space-y-4">
          {weeklyWorkouts && weeklyWorkouts.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {weeklyWorkouts.map((workout, index) => (
                <WorkoutCard
                  key={index}
                  workout={workout}
                  isToday={workout && workout.day === new Date().toLocaleDateString("en-US", { weekday: "long" })}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <p className="mb-4 text-muted-foreground">No workouts available yet.</p>
                <p className="text-sm text-muted-foreground">
                  Complete your profile to generate personalized workouts.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        <TabsContent value="exercises">
          <Card>
            <CardHeader>
              <CardTitle>Exercise Library</CardTitle>
              <CardDescription>Browse all available exercises with instructions and videos.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Coming soon! This feature will allow you to browse all exercises with detailed instructions and video
                demonstrations.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Workout History</CardTitle>
              <CardDescription>View your past workouts and track your progress over time.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Coming soon! This feature will allow you to view your workout history and track your progress over time.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
