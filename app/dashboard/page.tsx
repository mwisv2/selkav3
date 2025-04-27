"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { CalendarIcon, ChevronRight, Clock, Dumbbell, LineChart, Trophy } from "lucide-react"
import Link from "next/link"
import { WeightTracker } from "@/components/weight-tracker"
import { CalorieTracker } from "@/components/calorie-tracker"

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalWorkouts: 0,
    completedWorkouts: 0,
    totalTime: 0,
    streak: 0,
  })

  const [recentWorkouts, setRecentWorkouts] = useState<any[]>([])
  const [upcomingWorkouts, setUpcomingWorkouts] = useState<any[]>([])

  useEffect(() => {
    // Load stats from localStorage
    const savedStats = localStorage.getItem("workoutStats")
    if (savedStats) {
      setStats(JSON.parse(savedStats))
    }

    // Load completed workouts
    const completedWorkoutsStr = localStorage.getItem("completedWorkouts")
    if (completedWorkoutsStr) {
      const completedWorkouts = JSON.parse(completedWorkoutsStr)
      // Sort by date, most recent first
      completedWorkouts.sort((a: any, b: any) => {
        return new Date(b.completedDate).getTime() - new Date(a.completedDate).getTime()
      })
      setRecentWorkouts(completedWorkouts.slice(0, 3))
    }

    // Load upcoming workouts
    const userProfile = localStorage.getItem("userProfile")
    if (userProfile) {
      try {
        const profile = JSON.parse(userProfile)
        const daysPerWeek = profile.daysPerWeek || 3
        const workouts = []

        // Create upcoming workouts for the next week
        const today = new Date()
        const dayOfWeek = today.getDay() // 0 = Sunday, 1 = Monday, etc.

        // Get the user's workout days
        const workoutDays = profile.workoutDays || []

        // If no workout days are specified, create a default schedule
        const defaultDays = [1, 3, 5] // Monday, Wednesday, Friday
        const activeDays = workoutDays.length > 0 ? workoutDays : defaultDays.slice(0, daysPerWeek)

        // Create upcoming workouts
        for (let i = 0; i < 7; i++) {
          const date = new Date()
          date.setDate(today.getDate() + i)
          const day = date.getDay()

          if (activeDays.includes(day)) {
            workouts.push({
              date: date.toISOString(),
              title: getWorkoutTitle(day),
              description: getWorkoutDescription(day),
            })
          }

          if (workouts.length >= 3) break
        }

        setUpcomingWorkouts(workouts)
      } catch (e) {
        console.error("Error loading user profile:", e)
      }
    }
  }, [])

  const getWorkoutTitle = (day: number) => {
    const titles = ["Rest Day", "Upper Body", "Rest Day", "Lower Body", "Rest Day", "Full Body", "Rest Day"]
    return titles[day]
  }

  const getWorkoutDescription = (day: number) => {
    const descriptions = [
      "Recovery",
      "Chest, shoulders, and arms",
      "Recovery",
      "Legs and core",
      "Recovery",
      "Compound movements",
      "Recovery",
    ]
    return descriptions[day]
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
  }

  const formatTime = (minutes: number) => {
    // If the input is in seconds, convert to minutes
    if (minutes > 60) {
      const hours = Math.floor(minutes / 60)
      const mins = minutes % 60

      if (hours > 0) {
        return `${hours}h ${mins}m`
      }
      return `${mins}m`
    }

    // Input is already in minutes
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60

    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins}m`
  }

  return (
    // Added padding-top to avoid content being hidden behind the title bar
    <div className="space-y-4 overflow-y-auto pb-20 pt-16 container mx-auto px-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Workouts</CardTitle>
            <Dumbbell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedWorkouts}</div>
            <p className="text-xs text-muted-foreground">
              {stats.completedWorkouts > 0 ? "Keep up the good work!" : "Start your fitness journey today"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.streak} days</div>
            <p className="text-xs text-muted-foreground">
              {stats.streak > 0 ? "Don't break the chain!" : "Start your streak today"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Workout Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatTime(stats.totalTime)}</div>
            <p className="text-xs text-muted-foreground">Time invested in your health</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Workout</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {upcomingWorkouts.length > 0 ? formatDate(upcomingWorkouts[0].date) : "Not scheduled"}
            </div>
            <p className="text-xs text-muted-foreground">
              {upcomingWorkouts.length > 0 ? upcomingWorkouts[0].title : "Create your workout plan"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="weight">Weight</TabsTrigger>
          <TabsTrigger value="calories">Calories</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Recent Workouts</CardTitle>
                <CardDescription>Your latest completed workouts</CardDescription>
              </CardHeader>
              <CardContent>
                {recentWorkouts.length > 0 ? (
                  <div className="space-y-4">
                    {recentWorkouts.map((workout, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{workout.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(workout.completedDate)} •{" "}
                            {workout.netWorkoutTimeSeconds
                              ? formatTime(Math.round(workout.netWorkoutTimeSeconds / 60))
                              : workout.totalTimeSeconds
                                ? formatTime(Math.round(workout.totalTimeSeconds / 60))
                                : workout.duration}
                          </p>
                        </div>
                        <Button variant="ghost" size="icon">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Dumbbell className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No completed workouts yet</p>
                    <Link href="/dashboard/workouts" className="mt-4">
                      <Button>Start a Workout</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Upcoming Workouts</CardTitle>
                <CardDescription>Your scheduled workouts</CardDescription>
              </CardHeader>
              <CardContent>
                {upcomingWorkouts.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingWorkouts.map((workout, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{workout.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(workout.date)} • {workout.description}
                          </p>
                        </div>
                        <Link href="/dashboard/workouts">
                          <Button variant="ghost" size="icon">
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <CalendarIcon className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No upcoming workouts</p>
                    <Link href="/dashboard/workouts" className="mt-4">
                      <Button>Schedule a Workout</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Progress Overview</CardTitle>
              <CardDescription>Your fitness journey at a glance</CardDescription>
            </CardHeader>
            <CardContent className="h-[200px] flex items-center justify-center">
              <div className="text-center">
                <LineChart className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">Progress charts coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="weight">
          <Card>
            <CardHeader>
              <CardTitle>Weight Tracker</CardTitle>
              <CardDescription>Track your weight progress over time</CardDescription>
            </CardHeader>
            <CardContent>
              <WeightTracker />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="calories">
          <Card>
            <CardHeader>
              <CardTitle>Calorie Tracker</CardTitle>
              <CardDescription>Track your daily calorie intake</CardDescription>
            </CardHeader>
            <CardContent>
              <CalorieTracker />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
