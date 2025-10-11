"use client"

import { useState, useEffect } from "react"
import PropertyDescriptionGenerator from "@/components/property-description-generator"
import LoginPage from "@/components/login-page"

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/verify")
        const data = await response.json()
        setIsAuthenticated(data.authenticated)
      } catch (error) {
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false)
      }
    }
    checkAuth()
  }, [])

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="text-foreground">Loading...</div>
      </main>
    )
  }

  if (!isAuthenticated) {
    return <LoginPage onAuthenticated={() => setIsAuthenticated(true)} />
  }

  return (
    <main className="min-h-screen p-4 md:p-8">
      <PropertyDescriptionGenerator />
    </main>
  )
}
