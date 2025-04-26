import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

import { generateWorkouts as generateWorkoutsFromComponent } from "@/components/generate-workouts"

export const generateWorkouts = generateWorkoutsFromComponent

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
