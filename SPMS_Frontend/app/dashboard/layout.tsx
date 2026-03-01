"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/dashboard/sidebar"
import { DataLoader } from "@/components/data-loader"
import { useAppStore } from "@/lib/store"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const isAuthenticated = useAppStore((state) => state.isAuthenticated)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    // Wait for Zustand to load persisted state from localStorage
    const unsubFinishHydration = useAppStore.persist.onFinishHydration(() => setIsHydrated(true))
    setIsHydrated(useAppStore.persist.hasHydrated())
    return () => {
      unsubFinishHydration()
    }
  }, [])

  useEffect(() => {
    // Check if user is authenticated only after hydration has finished
    if (isHydrated && !isAuthenticated) {
      router.push("/login")
    }
  }, [isHydrated, isAuthenticated, router])

  if (!isHydrated || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-background">
      <DataLoader />
      <Sidebar />
      <main className="flex-1 lg:pl-0 pl-0">{children}</main>
    </div>
  )
}

