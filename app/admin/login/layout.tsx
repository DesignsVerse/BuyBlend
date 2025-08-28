import type React from "react"
import { AdminAuthProvider } from "@/lib/auth/admin-auth"

export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AdminAuthProvider>{children}</AdminAuthProvider>
}
