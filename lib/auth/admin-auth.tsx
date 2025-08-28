"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface AdminAuthContextType {
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  loading: boolean
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined)

// Simple admin credentials - in production, use proper authentication
const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "admin123",
}

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is already authenticated
    const authToken = localStorage.getItem("admin-auth-token")
    if (authToken === "authenticated") {
      setIsAuthenticated(true)
    }
    setLoading(false)
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
    console.log("[v0] Checking credentials...")
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      console.log("[v0] Credentials valid, setting auth token...")
      localStorage.setItem("admin-auth-token", "authenticated")
      setIsAuthenticated(true)
      console.log("[v0] Authentication state updated")
      return true
    }
    console.log("[v0] Invalid credentials provided")
    return false
  }

  const logout = () => {
    localStorage.removeItem("admin-auth-token")
    setIsAuthenticated(false)
    router.push("/admin/login")
  }

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, login, logout, loading }}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext)
  if (context === undefined) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider")
  }
  return context
}
