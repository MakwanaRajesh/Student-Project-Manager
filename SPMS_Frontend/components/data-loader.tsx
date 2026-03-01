"use client"

import { useEffect } from "react"
import { useAppStore } from "@/lib/store"

export function DataLoader() {
  const { isAuthenticated, loadAllData, dataLoaded } = useAppStore()

  useEffect(() => {
    if (isAuthenticated && !dataLoaded) {
      loadAllData()
    }
  }, [isAuthenticated, dataLoaded, loadAllData])

  return null
}
