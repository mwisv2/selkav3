"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WeightTracker } from "@/components/weight-tracker"
import { WorkoutCard } from "@/components/workout-card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Dumbbell, Plus, TrendingUp } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const [workouts, setWorkouts] = useState<any[]>([])
  const [todaysWorkouts, setTodaysWorkouts] = useState<any[]>([])
  const [stats, setStats] = useState<any>({
    totalWorkouts: 0,
    completedWorkouts: 0,
    totalTime: 0,
    streak: 0,
  })

  useEffect(() => {
    // Load workouts from localStorage
    const storedWorkouts = localStorage.getItem("generatedWorkouts")
    if (storedWorkouts) {
      try {
        const parsedWorkouts = JSON.parse(storedWorkouts)
        setWorkouts(parsedWorkouts)

        // Find today's workouts
        const today = new Date().toLocaleDateString("en-US", { weekday: "long" })
        const workoutsForToday = parsedWorkouts.filter((workout: any) => workout.day === today)
        setTodaysWorkouts(workoutsForToday)
      } catch (e) {
        console.error("Error parsing workouts:", e)
      }
    }

    // Load stats from localStorage
    const storedStats = localStorage.getItem("workoutStats")
    if (storedStats) {
      try {
        setStats(JSON.parse(storedStats))
      } catch (e) {
        console.error("Error parsing stats:", e)
      }
    }
  }, [])

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Workouts</CardTitle>
            <Dumbbell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalWorkouts || 0}</div>
            <p className="text-xs text-muted-foreground">Lifetime workouts</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedWorkouts || 0}</div>
            <p className="text-xs text-muted-foreground">Workouts completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Workout Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTime || 0} min</div>
            <p className="text-xs text-muted-foreground">Total time spent</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.streak || 0} days</div>
            <p className="text-xs text-muted-foreground">Keep it going!</p>
          </CardContent>
        </Card>
      </div>

      {/* Today's Workouts Section */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle>Today's Workouts</CardTitle>
          <CardDescription>
            {todaysWorkouts.length > 0
              ? `You have ${todaysWorkouts.length} workout${todaysWorkouts.length > 1 ? "s" : ""} scheduled for today`
              : "No workouts scheduled for today"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {todaysWorkouts.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {todaysWorkouts.map((workout, index) => (
                <WorkoutCard key={index} workout={workout} isToday={true} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-6 text-center">
              <p className="mb-4 text-muted-foreground">No workouts scheduled for today.</p>
              <Link href="/dashboard/workouts">
                <Button>
                  <Calendar className="mr-2 h-4 w-4" />
                  View All Workouts
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="weight">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="weight">Weight Tracker</TabsTrigger>
          <TabsTrigger value="calories">Calorie Tracker</TabsTrigger>
        </TabsList>
        <TabsContent value="weight" className="space-y-4">
          <WeightTracker />
        </TabsContent>
        <TabsContent value="calories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Calorie Tracker</CardTitle>
              <CardDescription>Track your daily calorie intake</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-[300px] bg-muted rounded-md flex items-center justify-center">
                <p className="text-muted-foreground">Calorie tracking coming soon</p>
              </div>
              <Button disabled className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Log Calories
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
