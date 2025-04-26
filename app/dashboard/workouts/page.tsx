"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WorkoutCard } from "@/components/workout-card"
import { generateWorkouts } from "@/components/generate-workouts"
import { useEffect, useState } from "react"

// Replace the component's content starting from the line after export default function WorkoutsPage() {
export default function WorkoutsPage() {
  const [weeklyWorkouts, setWeeklyWorkouts] = useState<any[]>([])

  useEffect(() => {
    // Load user profile from localStorage
    const profile = localStorage.getItem("userProfile")
    if (profile) {
      const userProfile = JSON.parse(profile)

      // Generate workouts based on user profile
      const workouts = generateWorkouts(userProfile)

      // Get workouts with sets for more detailed information
      // const workoutsWithSets = getWorkoutsWithSets(workouts, userProfile);

      // But we only need the basic workout info for this page
      setWeeklyWorkouts(workouts)
    }
  }, [])

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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {weeklyWorkouts.map((workout, index) => (
              <WorkoutCard
                key={index}
                title={workout.title}
                description={workout.description}
                day={workout.day}
                duration={workout.duration}
                exercises={workout.exercises}
              />
            ))}
          </div>
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
