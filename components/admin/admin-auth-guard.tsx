"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAdminAuth } from "@/lib/auth/admin-auth"

export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAdminAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    console.log("[v0] Auth guard check - authenticated:", isAuthenticated, "loading:", loading, "pathname:", pathname)
    if (!loading && !isAuthenticated && pathname !== "/admin/login") {
      console.log("[v0] Redirecting to login page...")
      router.push("/admin/login")
    }
  }, [isAuthenticated, loading, router, pathname])

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Show login page if not authenticated
  if (!isAuthenticated && pathname !== "/admin/login") {
    return null
  }

  return <>{children}</>
}
