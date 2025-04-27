"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Play, Pause, RotateCcw } from "lucide-react"

interface WorkoutTimerProps {
  onTimeUpdate: (seconds: number) => void
  isCompleted?: boolean
  autoStart?: boolean
}

export function WorkoutTimer({ onTimeUpdate, isCompleted = false, autoStart = true }: WorkoutTimerProps) {
  const [seconds, setSeconds] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const initializedRef = useRef(false)

  // Format seconds to MM:SS
  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  // Start/pause timer
  const toggle = () => {
    setIsActive(!isActive)
  }

  // Reset timer
  const reset = () => {
    setIsActive(false)
    setSeconds(0)
    onTimeUpdate(0)
  }

  // Effect to handle timer
  useEffect(() => {
    if (isActive && !isCompleted) {
      intervalRef.current = setInterval(() => {
        setSeconds((prevSeconds) => {
          const newSeconds = prevSeconds + 1
          onTimeUpdate(newSeconds)
          return newSeconds
        })
      }, 1000)
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isActive, isCompleted, onTimeUpdate])

  // Auto-start timer when component mounts, but only once
  useEffect(() => {
    if (autoStart && !isCompleted && !initializedRef.current) {
      initializedRef.current = true
      setIsActive(true)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [autoStart, isCompleted])

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-mono font-bold">{formatTime(seconds)}</div>
          <div className="flex space-x-2">
            <Button variant="outline" size="icon" onClick={toggle} disabled={isCompleted}>
              {isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button variant="outline" size="icon" onClick={reset} disabled={isCompleted}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
