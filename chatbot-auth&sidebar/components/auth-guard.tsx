"use client"

import { useAuth } from "@/components/auth-provider"
import { redirect } from "next/navigation"
import type { ReactNode } from "react"

export function AuthGuard({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    redirect("/login")
  }

  return <>{children}</>
}
