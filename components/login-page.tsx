"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface LoginPageProps {
  onAuthenticated: () => void
}

export default function LoginPage({ onAuthenticated }: LoginPageProps) {
  const { toast } = useToast()
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!password) {
      toast({
        title: "Password Required",
        description: "Please enter a password.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Access Granted",
          description: "Welcome to the Property Description Generator.",
        })
        onAuthenticated()
      } else {
        toast({
          title: "Access Denied",
          description: "Invalid password. Please try again.",
          variant: "destructive",
        })
        setPassword("")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to authenticate. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md border-2 border-border bg-card">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Lock className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl text-card-foreground">Property Description Generator</CardTitle>
          <CardDescription className="text-muted-foreground">
            Enter your password to access the application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-card-foreground">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-border bg-input text-foreground"
                autoFocus
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full border-2 border-primary bg-transparent text-primary hover:bg-primary hover:text-primary-foreground"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  <Lock className="mr-2 h-4 w-4" />
                  Access Application
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
