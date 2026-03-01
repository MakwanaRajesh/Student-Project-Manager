// "use client"

// import { useEffect } from "react"
// import { useAppStore } from "@/lib/store"

// export default function AuthProvider({ children }: { children: React.ReactNode }) {
//   const checkAuth = useAppStore((s) => s.checkAuth)

//   useEffect(() => {
//     checkAuth()
//   }, [])

//   return <>{children}</>
// }