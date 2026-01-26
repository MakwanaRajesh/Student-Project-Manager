import { redirect } from "next/navigation"

export default function Home() {
  redirect("/login")
}


// "use client"

// import { useEffect, useState } from "react"
// import { useRouter } from "next/navigation"

// export default function StudentDashboard() {
//   const router = useRouter()
//   const [user, setUser] = useState<any>(null)

//   useEffect(() => {
//     const storedUser = localStorage.getItem("spms_user")

//     if (!storedUser) {
//       router.replace("/login")
//       return
//     }

//     setUser(JSON.parse(storedUser))
//   }, [router])

//   if (!user) return null // prevent UI flicker

//   return <div>Student Dashboard</div>
// }
