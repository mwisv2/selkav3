"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function ProfilePage() {
  const [userProfile, setUserProfile] = useState<any>(null)

  useEffect(() => {
    // Load user profile from localStorage
    const profile = localStorage.getItem("userProfile")
    if (profile) {
      setUserProfile(JSON.parse(profile))
    }
  }, [])

  const handleSaveProfile = () => {
    // Save updated profile to localStorage
    localStorage.setItem("userProfile", JSON.stringify(userProfile))
    toast({
      title: "Profile updated",
      description: "Your profile has been successfully updated.",
    })
  }

  const handleChange = (field: string, value: any) => {
    setUserProfile((prev: any) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleEquipmentToggle = (value: string) => {
    const equipment = userProfile.equipment || []
    setUserProfile((prev: any) => ({
      ...prev,
      equipment: equipment.includes(value) ? equipment.filter((item: string) => item !== value) : [...equipment, value],
    }))
  }

  if (!userProfile) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Profile Not Found</CardTitle>
            <CardDescription>Please complete the onboarding process to set up your profile</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={() => (window.location.href = "/onboarding/step-1")}>
              Start Onboarding
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
        <p className="text-muted-foreground">Manage your profile and workout preferences</p>
      </div>

      <Tabs defaultValue="personal" className="space-y-4">
        <TabsList>
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="goals">Goals & Preferences</TabsTrigger>
          <TabsTrigger value="equipment">Equipment</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details and measurements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    value={userProfile.height || ""}
                    onChange={(e) => handleChange("height", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    value={userProfile.weight || ""}
                    onChange={(e) => handleChange("weight", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={userProfile.age || ""}
                  onChange={(e) => handleChange("age", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>1-Rep Max (kg)</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="squat">Squat</Label>
                    <Input
                      id="squat"
                      type="number"
                      value={userProfile.maxes?.squat || ""}
                      onChange={(e) => handleChange("maxes", { ...userProfile.maxes, squat: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bench">Bench Press</Label>
                    <Input
                      id="bench"
                      type="number"
                      value={userProfile.maxes?.bench || ""}
                      onChange={(e) => handleChange("maxes", { ...userProfile.maxes, bench: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deadlift">Deadlift</Label>
                    <Input
                      id="deadlift"
                      type="number"
                      value={userProfile.maxes?.deadlift || ""}
                      onChange={(e) => handleChange("maxes", { ...userProfile.maxes, deadlift: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="overhead">Overhead Press</Label>
                    <Input
                      id="overhead"
                      type="number"
                      value={userProfile.maxes?.overhead || ""}
                      onChange={(e) => handleChange("maxes", { ...userProfile.maxes, overhead: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveProfile}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="goals">
          <Card>
            <CardHeader>
              <CardTitle>Goals & Preferences</CardTitle>
              <CardDescription>Update your fitness goals and workout preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Fitness Goal</Label>
                <RadioGroup
                  value={userProfile.goal || ""}
                  onValueChange={(value) => handleChange("goal", value)}
                  className="space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="lose_weight" id="lose_weight" />
                    <Label htmlFor="lose_weight" className="cursor-pointer">
                      Lose Weight
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="gain_weight" id="gain_weight" />
                    <Label htmlFor="gain_weight" className="cursor-pointer">
                      Gain Weight
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="maintain_weight" id="maintain_weight" />
                    <Label htmlFor="maintain_weight" className="cursor-pointer">
                      Maintain Weight
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="lose_fat" id="lose_fat" />
                    <Label htmlFor="lose_fat" className="cursor-pointer">
                      Lose Fat
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="gain_muscle" id="gain_muscle" />
                    <Label htmlFor="gain_muscle" className="cursor-pointer">
                      Gain Muscle
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="timePerDay">Time per day (minutes)</Label>
                  <Input
                    id="timePerDay"
                    type="number"
                    value={userProfile.timePerDay || ""}
                    onChange={(e) => handleChange("timePerDay", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="daysPerWeek">Days per week</Label>
                  <Select
                    value={userProfile.daysPerWeek || ""}
                    onValueChange={(value) => handleChange("daysPerWeek", value)}
                  >
                    <SelectTrigger id="daysPerWeek">
                      <SelectValue placeholder="Select days" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                        <SelectItem key={day} value={day.toString()}>
                          {day} {day === 1 ? "day" : "days"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Cycle Length</Label>
                <RadioGroup
                  value={userProfile.cycle || ""}
                  onValueChange={(value) => handleChange("cycle", value)}
                  className="space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1-week" id="1-week" />
                    <Label htmlFor="1-week" className="cursor-pointer">
                      1-week cycle
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="2-week" id="2-week" />
                    <Label htmlFor="2-week" className="cursor-pointer">
                      2-week cycle
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalWeeks">Total weeks to train</Label>
                <Input
                  id="totalWeeks"
                  type="number"
                  value={userProfile.totalWeeks || ""}
                  onChange={(e) => handleChange("totalWeeks", e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveProfile}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="equipment">
          <Card>
            <CardHeader>
              <CardTitle>Available Equipment</CardTitle>
              <CardDescription>Update the equipment you have access to</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                {[
                  "Dumbbells",
                  "Barbell",
                  "Squat Rack",
                  "Bench Press",
                  "Pull-up Bar",
                  "Resistance Bands",
                  "Kettlebells",
                  "Cable Machine",
                  "Leg Press",
                  "Smith Machine",
                  "Treadmill",
                  "Exercise Bike",
                  "Elliptical",
                  "No Equipment (Bodyweight only)",
                ].map((item) => (
                  <div key={item} className="flex items-center space-x-2">
                    <Checkbox
                      id={item}
                      checked={(userProfile.equipment || []).includes(item)}
                      onCheckedChange={() => handleEquipmentToggle(item)}
                    />
                    <Label htmlFor={item} className="cursor-pointer">
                      {item}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveProfile}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your account preferences and notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="your.email@example.com" />
              </div>

              <div className="space-y-2">
                <Label>Notifications</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="workout_reminders" defaultChecked />
                    <Label htmlFor="workout_reminders" className="cursor-pointer">
                      Workout reminders
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="progress_updates" defaultChecked />
                    <Label htmlFor="progress_updates" className="cursor-pointer">
                      Weekly progress updates
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="new_features" defaultChecked />
                    <Label htmlFor="new_features" className="cursor-pointer">
                      New features and updates
                    </Label>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveProfile}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      <Toaster />
    </div>
  )
}
