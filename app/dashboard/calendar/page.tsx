"use client"

import { useState, useEffect } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dumbbell, ChevronLeft, ChevronRight } from "lucide-react"
import { generateWorkouts } from "@/components/generate-workouts"
import { Button } from "@/components/ui/button"

// Function to generate workouts based on user profile
const generateWorkoutEvents = (userProfile: any) => {
  const workouts = []
  if (userProfile && userProfile.daysPerWeek) {
    // Generate workouts using the workout generator
    const generatedWorkouts = generateWorkouts(userProfile)

    // Map to calendar events
    generatedWorkouts.forEach((workout, index) => {
      workouts.push({
        day: workout.day,
        title: workout.title,
        description: workout.description,
        duration: workout.duration,
      })
    })
  }
  return workouts
}

export default function CalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [selectedDateEvents, setSelectedDateEvents] = useState<any[]>([])
  const [workoutEvents, setWorkoutEvents] = useState<
    { date: Date; type: string; completed: boolean; description: string; duration: string }[]
  >([])
  const [viewMode, setViewMode] = useState<"month" | "week">("month")
  const [currentMonth, setCurrentMonth] = useState(new Date())

  // Function to check if a date has a workout
  const hasWorkout = (date: Date) => {
    return workoutEvents.some(
      (event) =>
        event.date.getDate() === date.getDate() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getFullYear() === date.getFullYear(),
    )
  }

  // Function to get workouts for a specific date
  const getWorkoutsForDate = (date: Date) => {
    return workoutEvents.filter(
      (event) =>
        event.date.getDate() === date.getDate() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getFullYear() === date.getFullYear(),
    )
  }

  // Handle date change
  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate)
    if (newDate) {
      setSelectedDateEvents(getWorkoutsForDate(newDate))
    } else {
      setSelectedDateEvents([])
    }
  }

  // Navigate to previous/next month
  const navigateMonth = (direction: "prev" | "next") => {
    const newMonth = new Date(currentMonth)
    if (direction === "prev") {
      newMonth.setMonth(newMonth.getMonth() - 1)
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1)
    }
    setCurrentMonth(newMonth)
  }

  useEffect(() => {
    // Load completed workouts from localStorage
    const completedWorkouts = JSON.parse(localStorage.getItem("completedWorkouts") || "[]")

    // Convert to calendar events
    const events = completedWorkouts.map((workout: any) => ({
      date: new Date(workout.completedDate),
      type: workout.title,
      description: workout.description,
      duration: workout.duration,
      completed: true,
    }))

    // Load user profile to get scheduled workouts
    const profile = localStorage.getItem("userProfile")
    if (profile) {
      const userProfile = JSON.parse(profile)

      // Generate workouts based on user profile
      const generatedWorkouts = generateWorkoutEvents(userProfile)

      // Add future workouts to calendar
      const today = new Date()
      const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

      // Generate workouts for the next 12 weeks (3 months)
      for (let week = 0; week < 12; week++) {
        generatedWorkouts.forEach((workout: any) => {
          // Find the day of the week for this workout
          const workoutDay = weekdays.indexOf(workout.day)

          // Calculate the date for this workout in the current week
          const workoutDate = new Date(today)

          // Adjust to the current week's instance of this weekday
          const dayDiff = (workoutDay + 7 - today.getDay()) % 7
          workoutDate.setDate(today.getDate() + dayDiff + week * 7)

          // Add this workout to events
          events.push({
            date: new Date(workoutDate),
            type: workout.title,
            description: workout.description,
            duration: workout.duration,
            completed: false,
          })
        })
      }
    }

    setWorkoutEvents(events)

    // Set selected date events for today
    if (date) {
      setSelectedDateEvents(
        events.filter(
          (event) =>
            event.date.getDate() === date.getDate() &&
            event.date.getMonth() === date.getMonth() &&
            event.date.getFullYear() === date.getFullYear(),
        ),
      )
    }
  }, [date])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Workout Calendar</h1>
        <p className="text-muted-foreground">View your scheduled workouts and track your consistency</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>Calendar</CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="icon" onClick={() => navigateMonth("prev")}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium">
                {currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </span>
              <Button variant="outline" size="icon" onClick={() => navigateMonth("next")}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateChange}
              month={currentMonth}
              className="rounded-md border"
              modifiers={{
                workout: (date) => hasWorkout(date),
              }}
              modifiersClassNames={{
                workout: "bg-primary/10 font-bold",
              }}
              components={{
                DayContent: (props) => {
                  const workouts = getWorkoutsForDate(props.date)
                  return (
                    <div className="relative h-full w-full p-2">
                      <div>{props.date.getDate()}</div>
                      {workouts.length > 0 && (
                        <div className="absolute bottom-1 right-1">
                          <div
                            className={`h-1.5 w-1.5 rounded-full ${workouts[0].completed ? "bg-green-500" : "bg-primary"}`}
                          />
                        </div>
                      )}
                    </div>
                  )
                },
              }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              {date
                ? date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })
                : "No Date Selected"}
            </CardTitle>
            <CardDescription>
              {selectedDateEvents.length > 0
                ? `${selectedDateEvents.length} workout${selectedDateEvents.length > 1 ? "s" : ""} scheduled`
                : "No workouts scheduled for this day"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedDateEvents.length > 0 ? (
              <div className="space-y-4">
                {selectedDateEvents.map((event, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 rounded-lg border">
                    <div
                      className={`rounded-full p-2 ${event.completed ? "bg-green-100 dark:bg-green-900" : "bg-primary/10"}`}
                    >
                      <Dumbbell
                        className={`h-5 w-5 ${event.completed ? "text-green-600 dark:text-green-400" : "text-primary"}`}
                      />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium">{event.type}</h3>
                        {event.completed ? (
                          <Badge
                            variant="outline"
                            className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                          >
                            Completed
                          </Badge>
                        ) : (
                          <Badge variant="outline">Scheduled</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {event.duration} • {event.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <p className="text-muted-foreground">No workouts scheduled for this day.</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Rest days are important too! Use this time for recovery or light activity.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
