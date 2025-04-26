"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function CalorieTracker() {
  const [data, setData] = useState<{ date: string; calories: number; goal: number }[]>([])
  const [calories, setCalories] = useState("")
  const [day, setDay] = useState("Today")
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [calorieGoal, setCalorieGoal] = useState(2000) // Default goal

  // Load data on component mount
  useEffect(() => {
    const storedData = localStorage.getItem("calorieData")
    if (storedData) {
      try {
        setData(JSON.parse(storedData))
      } catch (e) {
        console.error("Error parsing calorie data:", e)
        setData([])
      }
    }

    const storedGoal = localStorage.getItem("calorieGoal")
    if (storedGoal) {
      try {
        setCalorieGoal(JSON.parse(storedGoal))
      } catch (e) {
        console.error("Error parsing calorie goal:", e)
      }
    }

    // Initialize with last 7 days if empty
    if (!storedData || JSON.parse(storedData).length === 0) {
      const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
      const today = new Date().getDay()

      const initialData = weekdays.map((day, index) => {
        const adjustedIndex = (today - 6 + index + 7) % 7
        return {
          date: weekdays[adjustedIndex],
          calories: 0,
          goal: 2000,
        }
      })

      setData(initialData)
    }

    setIsLoading(false)
  }, [])

  // Save data when it changes
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("calorieData", JSON.stringify(data))
      localStorage.setItem("calorieGoal", JSON.stringify(calorieGoal))
    }
  }, [data, calorieGoal, isLoading])

  const handleAddCalories = () => {
    if (!calories) return

    const dayMap: Record<string, string> = {
      Today: "Sun",
      Yesterday: "Sat",
      "2 days ago": "Fri",
      "3 days ago": "Thu",
      "4 days ago": "Wed",
      "5 days ago": "Tue",
      "6 days ago": "Mon",
    }

    const updatedData = [...data]
    const dayIndex = updatedData.findIndex((item) => item.date === dayMap[day])

    if (dayIndex !== -1) {
      updatedData[dayIndex] = {
        ...updatedData[dayIndex],
        calories: Number.parseInt(calories),
        goal: calorieGoal,
      }
      setData(updatedData)
    } else {
      // If day not found, add it
      setData([
        ...data,
        {
          date: dayMap[day],
          calories: Number.parseInt(calories),
          goal: calorieGoal,
        },
      ])
    }

    setCalories("")
    setOpen(false)
  }

  return (
    <div className="space-y-4">
      <div className="h-[300px] bg-background">
        {data.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-muted-foreground text-center">
              No calorie data available yet. Start tracking your calories to see progress.
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip contentStyle={{ backgroundColor: "var(--background)", borderColor: "var(--border)" }} />
              <Bar dataKey="calories" fill="hsl(var(--primary))" />
              <Bar dataKey="goal" fill="hsl(var(--muted))" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="flex justify-center gap-2">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Log Calories
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Log Calories</DialogTitle>
              <DialogDescription>Enter your calorie intake for the day.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="day" className="text-right">
                  Day
                </Label>
                <Select value={day} onValueChange={setDay}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select day" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Today">Today</SelectItem>
                    <SelectItem value="Yesterday">Yesterday</SelectItem>
                    <SelectItem value="2 days ago">2 days ago</SelectItem>
                    <SelectItem value="3 days ago">3 days ago</SelectItem>
                    <SelectItem value="4 days ago">4 days ago</SelectItem>
                    <SelectItem value="5 days ago">5 days ago</SelectItem>
                    <SelectItem value="6 days ago">6 days ago</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="calories" className="text-right">
                  Calories
                </Label>
                <Input
                  id="calories"
                  type="number"
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="goal" className="text-right">
                  Daily Goal
                </Label>
                <Input
                  id="goal"
                  type="number"
                  value={calorieGoal}
                  onChange={(e) => setCalorieGoal(Number(e.target.value))}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddCalories}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
