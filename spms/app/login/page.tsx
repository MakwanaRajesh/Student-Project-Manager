"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { GraduationCap, User, Lock, ArrowRight, BookOpen, Users, ClipboardList } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAppStore, type UserRole } from "@/lib/store"
import { toast } from "sonner"

const demoUsers = {
  admin: { id: "admin1", name: "Admin User", email: "admin@university.edu", role: "admin" as UserRole },
  faculty: {
    id: "1",
    name: "Dr. Rajesh Kumar",
    email: "rajesh.kumar@university.edu",
    role: "faculty" as UserRole,
  },
  student: { id: "1", name: "Arjun Mehta", email: "arjun.m@student.edu", role: "student" as UserRole },
}

function getRedirectPath(role: UserRole): string {
  switch (role) {
    case "student":
      return "/dashboard/student"
    case "faculty":
      return "/dashboard/faculty"
    case "admin":
      return "/dashboard/admin"
    default:
      return "/login"
  }
}

export default function LoginPage() {
  const router = useRouter()
  const login = useAppStore((state) => state.login)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<UserRole>("student")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password || !role) {
      toast.error("All Fields Are Required")
      return
    }

    setIsLoading(true)


    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password,
          role
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || "Login Failed")
        setIsLoading(false)
        return
      }

      login({
        id: data.user.id,
        name: email.split("@")[0], // simple display name
        email: data.user.email,
        role: data.user.role,
      })


      // localStorage.setItem(
      //   "spms_user",
      //   JSON.stringify({
      //     id: data.user.id,
      //     name: data.user.name,
      //     email: data.user.email,
      //     role: data.user.role,
      //   })
      // )

      router.push(getRedirectPath(data.user.role))

      useEffect(() => {
        const user = localStorage.getItem("spms_user")

        if (user) {
          const parsedUser = JSON.parse(user)
          router.replace(getRedirectPath(parsedUser.role))
        }
      }, [router])



      toast.success("Login Successful")
      router.push(getRedirectPath(data.user.role))
    } catch (error) {
      toast.error("Server Error")
    } finally {
      setIsLoading(false)
    }

    // Simulate API call
    // await new Promise((resolve) => setTimeout(resolve, 1000))

    // const user = demoUsers[role]
    // login(user)
    // toast.success(`Welcome, ${user.name}!`)
    // router.push(getRedirectPath(role))
    // setIsLoading(false)
  }

  const handleDemoLogin = async (demoRole: UserRole) => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500))
    const user = demoUsers[demoRole]
    login(user)
    toast.success(`Welcome, ${user.name}!`)
    router.push(getRedirectPath(demoRole))
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-sidebar relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-lg">
              <GraduationCap className="h-8 w-8 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-sidebar-foreground">SPMS</span>
          </div>

          <div className="space-y-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <h1 className="text-4xl font-bold text-sidebar-foreground leading-tight">
                Student Project
                <br />
                Management System
              </h1>
              <p className="mt-4 text-lg text-sidebar-foreground/70 max-w-md">
                Streamline your academic projects with efficient group management, meeting tracking, and progress
                monitoring.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 gap-4 max-w-md">
              {[
                { icon: BookOpen, title: "Project Tracking", desc: "Monitor progress effortlessly" },
                { icon: Users, title: "Team Collaboration", desc: "Work together seamlessly" },
                { icon: ClipboardList, title: "Meeting Management", desc: "Schedule and track meetings" },
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-center gap-4 p-4 rounded-lg bg-sidebar-accent/50 border border-sidebar-border"
                >
                  <div className="p-2 bg-primary/20 rounded-lg">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sidebar-foreground">{feature.title}</h3>
                    <p className="text-sm text-sidebar-foreground/60">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <p className="text-sm text-sidebar-foreground/50">© 2026 Student Project Management System</p>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="p-2 bg-primary rounded-lg">
              <GraduationCap className="h-8 w-8 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold">SPMS</span>
          </div>

          <Card className="border-border/50 shadow-xl">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
              <CardDescription>Sign in to your account to continue</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="role">Login as</Label>
                  <Select value={role} onValueChange={(v) => setRole(v as UserRole)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrator</SelectItem>
                      <SelectItem value="faculty">Faculty</SelectItem>
                      <SelectItem value="student">Student</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign in"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Quick Demo Access</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {(["admin", "faculty", "student"] as UserRole[]).map((r) => (
                  <Button
                    key={r}
                    variant="outline"
                    size="sm"
                    onClick={() => handleDemoLogin(r)}
                    disabled={isLoading}
                    className="capitalize"
                  >
                    {r}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
