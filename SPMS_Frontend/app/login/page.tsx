"use client"

import type React from "react"
import { useState, useEffect } from "react"
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

function getRedirectPath(role: UserRole): string {
  switch (role) {
    case "student": return "/dashboard/student"
    case "faculty": return "/dashboard/faculty"
    case "admin": return "/dashboard/admin"
    default: return "/dashboard"
  }
}

export default function LoginPage() {
  const router = useRouter()
  const { login, isLoading, isAuthenticated, user } = useAppStore()
  const [isHydrated, setIsHydrated] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<UserRole>("student")

  useEffect(() => {
    const unsubFinishHydration = useAppStore.persist.onFinishHydration(() => setIsHydrated(true))
    setIsHydrated(useAppStore.persist.hasHydrated())
    return () => unsubFinishHydration()
  }, [])

  useEffect(() => {
    if (isHydrated && isAuthenticated && user?.role) {
      router.push(getRedirectPath(user.role))
    }
  }, [isHydrated, isAuthenticated, user, router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) { toast.error("Email and password are required"); return }
    try {
      await login(email, password, role)
      toast.success("Welcome back!")
      router.push(getRedirectPath(role))
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Login failed. Check credentials.")
    }
  }

  const handleDemoLogin = async (demoRole: UserRole) => {
    const demos: Record<UserRole, { email: string; password: string }> = {
      admin: { email: "admin@university.edu", password: "Admin@123" },
      faculty: { email: "rajesh.kumar@university.edu", password: "Faculty@123" },
      student: { email: "arjun.m@student.edu", password: "Student@123" },
    }
    const creds = demos[demoRole]
    try {
      await login(creds.email, creds.password, demoRole)
      toast.success("Demo login successful!")
      router.push(getRedirectPath(demoRole))
    } catch {
      toast.error("Demo login failed. Make sure the backend is running.")
    }
  }

  if (!isHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex">
      <div className="hidden lg:flex lg:w-1/2 bg-sidebar relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-lg"><GraduationCap className="h-8 w-8 text-primary-foreground" /></div>
            <span className="text-2xl font-bold text-sidebar-foreground">SPMS</span>
          </div>
          <div className="space-y-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <h1 className="text-4xl font-bold text-sidebar-foreground leading-tight">Student Project<br />Management System</h1>
              <p className="mt-4 text-lg text-sidebar-foreground/70 max-w-md">Streamline your academic projects with efficient group management, meeting tracking, and progress monitoring.</p>
            </motion.div>
            <div className="grid grid-cols-1 gap-4 max-w-md">
              {[{ icon: BookOpen, title: "Project Tracking", desc: "Monitor progress effortlessly" }, { icon: Users, title: "Team Collaboration", desc: "Work together seamlessly" }, { icon: ClipboardList, title: "Meeting Management", desc: "Schedule and track meetings" }].map((feature, index) => (
                <motion.div key={feature.title} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + index * 0.1 }} className="flex items-center gap-4 p-4 rounded-lg bg-sidebar-accent/50 border border-sidebar-border">
                  <div className="p-2 bg-primary/20 rounded-lg"><feature.icon className="h-5 w-5 text-primary" /></div>
                  <div><h3 className="font-medium text-sidebar-foreground">{feature.title}</h3><p className="text-sm text-sidebar-foreground/60">{feature.desc}</p></div>
                </motion.div>
              ))}
            </div>
          </div>
          <p className="text-sm text-sidebar-foreground/50">© 2026 Student Project Management System</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="p-2 bg-primary rounded-lg"><GraduationCap className="h-8 w-8 text-primary-foreground" /></div>
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
                    <SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger>
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
                    <Input id="email" type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="password" type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10" />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign in"}<ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">Quick Demo Access</span></div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {(["admin", "faculty", "student"] as UserRole[]).map((r) => (
                  <Button key={r} variant="outline" size="sm" onClick={() => handleDemoLogin(r)} disabled={isLoading} className="capitalize">{r}</Button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground text-center mt-4">Make sure the backend API is running on http://localhost:5000</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
