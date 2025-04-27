"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { SkipForward } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface RestTimerProps {
  duration: number
  onComplete: () => void
  isActive: boolean
}

export function RestTimer({ duration, onComplete, isActive }: RestTimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration)
  const [progress, setProgress] = useState(100)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1
          setProgress((newTime / duration) * 100)
          return newTime
        })
      }, 1000)
    } else if (timeLeft === 0 && isActive) {
      onComplete()
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [timeLeft, isActive, duration, onComplete])

  // Reset timer when duration changes or becomes active
  useEffect(() => {
    setTimeLeft(duration)
    setProgress(100)
  }, [duration, isActive])

  const handleSkip = () => {
    setTimeLeft(0)
    setProgress(0)
    onComplete()
  }

  // Format seconds to MM:SS
  const formatTime = (seconds: number) => {
    return `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, "0")}`
  }

  if (!isActive) return null

  return (
    <Card className="mb-4 border-primary/20 bg-primary/5">
      <CardContent className="p-4">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Rest Time</h3>
              <p className="text-2xl font-mono font-bold">{formatTime(timeLeft)}</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleSkip}>
              <SkipForward className="h-4 w-4 mr-2" />
              Skip
            </Button>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardContent>
    </Card>
  )
}
