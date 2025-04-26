"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
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

export function WeightTracker() {
  const [data, setData] = useState<{ date: string; weight: number }[]>([])
  const [newWeight, setNewWeight] = useState("")
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [currentWeight, setCurrentWeight] = useState<number | null>(null)

  // Load data on component mount
  useEffect(() => {
    const storedData = localStorage.getItem("weightData")
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData)
        setData(parsedData)

        // Set current weight from the most recent entry
        if (parsedData.length > 0) {
          setCurrentWeight(parsedData[parsedData.length - 1].weight)
        }
      } catch (e) {
        console.error("Error parsing weight data:", e)
        setData([])
      }
    }
    setIsLoading(false)
  }, [])

  // Save data when it changes
  useEffect(() => {
    if (!isLoading && data.length > 0) {
      localStorage.setItem("weightData", JSON.stringify(data))

      // Update current weight whenever data changes
      setCurrentWeight(data[data.length - 1].weight)

      // Also save to user profile for data syncing
      try {
        const userProfile = JSON.parse(localStorage.getItem("userProfile") || "{}")
        userProfile.weight = data[data.length - 1].weight
        localStorage.setItem("userProfile", JSON.stringify(userProfile))
      } catch (e) {
        console.error("Error updating user profile with weight:", e)
      }
    }
  }, [data, isLoading])

  const handleAddWeight = () => {
    if (!newWeight) return

    const today = new Date()
    const formattedDate = today.toLocaleDateString("en-US", { month: "short", day: "numeric" })

    const newData = [...data, { date: formattedDate, weight: Number.parseFloat(newWeight) }]
    setData(newData)
    setNewWeight("")
    setOpen(false)
  }

  return (
    <div className="space-y-4">
      {currentWeight !== null && (
        <div className="bg-background p-4 rounded-lg border mb-4">
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Current Weight</h3>
          <p className="text-2xl font-bold">{currentWeight} kg</p>
        </div>
      )}

      <div className="h-[300px] bg-background rounded-lg border p-4">
        {data.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-muted-foreground text-center">
              No weight data available yet. Start tracking your weight to see progress.
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={["dataMin - 2", "dataMax + 2"]} />
              <Tooltip contentStyle={{ backgroundColor: "var(--background)", borderColor: "var(--border)" }} />
              <Line type="monotone" dataKey="weight" stroke="hsl(var(--primary))" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="flex justify-center">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Log Weight
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Log Weight</DialogTitle>
              <DialogDescription>Enter your current weight to track your progress.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="weight" className="text-right">
                  Weight (kg)
                </Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  value={newWeight}
                  onChange={(e) => setNewWeight(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddWeight}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
