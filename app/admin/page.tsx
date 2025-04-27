"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, AlertCircle } from "lucide-react"
import { initializeApp } from "firebase/app"
import { getFirestore, doc, getDoc } from "firebase/firestore"
import { useRouter } from "next/navigation"

// Initialize Firebase (will use env variables)
const initFirebase = () => {
  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  }

  const app = initializeApp(firebaseConfig)
  return getFirestore(app)
}

export default function AdminLoginPage() {
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [db, setDb] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    // Initialize Firebase on client side only
    try {
      const firestoreDb = initFirebase()
      setDb(firestoreDb)
    } catch (err) {
      console.error("Firebase initialization error:", err)
      setError("Failed to initialize database connection")
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      if (!db) {
        throw new Error("Database connection not established")
      }

      // Get admin document from Firestore
      const adminDocRef = doc(db, "admin", "admin")
      const adminDoc = await getDoc(adminDocRef)

      if (!adminDoc.exists()) {
        throw new Error("Admin configuration not found")
      }

      const adminData = adminDoc.data()

      // Check if admin account is active
      if (!adminData.isActive) {
        throw new Error("Admin access is currently disabled")
      }

      // Verify password
      if (adminData.key === password) {
        // Set success state
        setSuccess(true)
        
        // Create admin session to bypass middleware restrictions
        localStorage.setItem("adminAuthenticated", "true")
        
        // Redirect to step-1 after short delay
        setTimeout(() => {
          router.push("/step-1")
        }, 1000)
      } else {
        throw new Error("Invalid password")
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed")
      console.error("Login error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-2">
              <Shield className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-2xl">Admin Access</CardTitle>
            <CardDescription>
              Enter your admin password to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {success && (
              <Alert className="mb-4 bg-green-100 dark:bg-green-900 border-green-500">
                <AlertDescription className="text-green-800 dark:text-green-200">
                  Login successful. Redirecting to application...
                </AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleLogin}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="password">Admin Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter admin password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    className="border-gray-300 dark:border-gray-700"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Authenticating..." : "Sign In"}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2 text-center text-sm text-muted-foreground">
            <div>This page is restricted to administrators only.</div>
            <div>
              <a href="/" className="underline hover:text-primary">
                Return to Home
              </a>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}