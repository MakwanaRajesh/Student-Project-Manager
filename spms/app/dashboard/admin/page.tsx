"use client"

import { useEffect, useState } from "react";
import { motion } from "framer-motion"
import Link from "next/link"
import {
  Users,
  FolderKanban,
  Calendar,
  TrendingUp,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Settings,
  GraduationCap,
  UserCog,
  BarChart3,
} from "lucide-react"
import { Header } from "@/components/dashboard/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useAppStore } from "@/lib/store"


interface DashTotal {
  id: number;
  StudentName: string;
  totalStudent: number;
  totalStaff: number;
  totalProjectTypes: number;
  totalProjects: number;
}

interface ProjectGroup {
  ProjectGroupID: number;
  id: number
  name: string
  projectTitle: string
  projectArea: string
  projectTypeId: number
  projectTypeName: string
  guideStaffName: string
  averageCpi: number
  membersCount: number
  status: "approved" | "pending" | "rejected"
}


const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export default function AdminDashboard() {
  const { user, meetings, students, staff, projectTypes } = useAppStore()

  const [projectGroups, setProjectGroups] = useState<ProjectGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("")
  const [totalStudent, setTotalStudent] = useState<DashTotal[]>([]);
  const [totalStaff, setTotalStaff] = useState<DashTotal[]>([]);
  const [totalProjectTypes, setTotalProjectTypes] = useState<DashTotal[]>([]);
  const [totalProjects, setTotalProjects] = useState<DashTotal[]>([]);



  useEffect(() => {
    async function fetchProjectGroups() {
      try {
        const res = await fetch("/api/project-groups")

        if (!res.ok) {
          throw new Error("Failed to fetch project groups")
        }

        const data: ProjectGroup[] = await res.json()
        setProjectGroups(data)
      } catch (err) {
        setError("Something went wrong while loading project groups")
      } finally {
        setLoading(false)
      }
    }

    fetchProjectGroups()
  }, [])

  useEffect(() => {
    fetch("/api/students")
      .then(res => res.json())
      .then(setTotalStudent)
      .catch(console.error);
  }, []);

  useEffect(() => {
    fetch("/api/staff")
      .then(res => res.json())
      .then(setTotalStaff)
      .catch(console.error)
  }, []);
  useEffect(() => {
    fetch("/api/project-types")
      .then(res => res.json())
      .then(setTotalProjectTypes)
      .catch(console.error)
  }, []);

  useEffect(() => {
    fetch("/api/project-groups")
      .then(res => res.json())
      .then(setTotalProjects)
      .catch(console.error)
  }, []);



  const stats = [
    {
      title: "Total Projects",
      value: totalProjects.length.toString() ?? "0",
      change: "+12%",
      trend: "up",
      icon: FolderKanban,
      color: "bg-primary/10 text-primary",
    },
    {
      title: "Active Students",
      value: totalStudent.length.toString() ?? "0",
      change: "+8%",
      trend: "up",
      icon: GraduationCap,
      color: "bg-accent/10 text-accent",
    },
    {
      title: "Faculty Members",
      value: totalStaff.length.toString() ?? "0",
      change: "+2",
      trend: "up",
      icon: UserCog,
      color: "bg-success/10 text-success",
    },
    {
      title: "Project Types",
      value: totalProjectTypes.length.toString() ,
      change: "Active",
      trend: "neutral",
      icon: Settings,
      color: "bg-warning/10 text-warning",
    },
  ]

  const pendingGroups = projectGroups.filter((g) => g.status === "pending")
  const approvedGroups = projectGroups.filter((g) => g.status === "approved")
  const rejectedGroups = projectGroups.filter((g) => g.status === "rejected")

  const recentProjects = projectGroups.slice(0, 5)

  return (
    <div className="min-h-screen">
      <Header
        title={`Welcome, ${user?.name?.split(" ")[0] || "Admin"}!`}
        description="System overview and administrative controls."
      />

      <motion.div variants={container} initial="hidden" animate="show" className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <motion.div key={stat.title} variants={item}>
              <Card className="border-border/50 hover:border-primary/30 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-xl ${stat.color}`}>
                      <stat.icon className="h-5 w-5" />
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      {stat.trend === "up" ? (
                        <ArrowUpRight className="h-4 w-4 text-success" />
                      ) : stat.trend === "down" ? (
                        <ArrowDownRight className="h-4 w-4 text-destructive" />
                      ) : null}
                      <span
                        className={
                          stat.trend === "up"
                            ? "text-success"
                            : stat.trend === "down"
                              ? "text-destructive"
                              : "text-muted-foreground"
                        }
                      >
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-3xl font-bold">{stat.value}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{stat.title}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Project Status Overview */}
        <motion.div variants={item}>
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Project Status Overview</CardTitle>
              <CardDescription>Distribution of project statuses across the system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-success/5 border border-success/20">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-success/10">
                      <FolderKanban className="h-5 w-5 text-success" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-success">{approvedGroups.length}</p>
                      <p className="text-sm text-muted-foreground">Approved Projects</p>
                    </div>
                  </div>
                  <Progress value={projectGroups.length ? (approvedGroups.length / projectGroups.length) * 100 : 0} className="h-2 mt-4" />
                </div>
                <div className="p-4 rounded-lg bg-warning/5 border border-warning/20">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-warning/10">
                      <Clock className="h-5 w-5 text-warning" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-warning">{pendingGroups.length}</p>
                      <p className="text-sm text-muted-foreground">Pending Approval</p>
                    </div>
                  </div>
                  <Progress value={(pendingGroups.length / projectGroups.length) * 100} className="h-2 mt-4" />
                </div>
                <div className="p-4 rounded-lg bg-destructive/5 border border-destructive/20">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-destructive/10">
                      <FolderKanban className="h-5 w-5 text-destructive" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-destructive">{rejectedGroups.length}</p>
                      <p className="text-sm text-muted-foreground">Rejected Projects</p>
                    </div>
                  </div>
                  <Progress value={(rejectedGroups.length / projectGroups.length) * 100} className="h-2 mt-4" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Projects */}
          <motion.div variants={item} className="lg:col-span-2">
            <Card className="border-border/50">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Projects</CardTitle>
                  <CardDescription>Latest project submissions and updates</CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/dashboard/admin/projects">View All</Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentProjects.map((project) => (
                    <div
                      key={project.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-lg bg-primary/10">
                          <FolderKanban className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">{project.projectTitle}</h4>
                          <p className="text-sm text-muted-foreground">
                            {project.name} • {project.guideStaffName}
                          </p>
                        </div>
                      </div>
                      <Badge
                        className={
                          project.status === "approved"
                            ? "bg-success/10 text-success border-success/30"
                            : project.status === "pending"
                              ? "bg-warning/10 text-warning border-warning/30"
                              : "bg-destructive/10 text-destructive border-destructive/30"
                        }
                      >
                        {project.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* System Stats */}
          <motion.div variants={item}>
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>System Overview</CardTitle>
                <CardDescription>Key metrics and activity</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm">Total Meetings</span>
                  </div>
                  <span className="font-semibold">{meetings.length}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm">Avg Group Size</span>
                  </div>
                  <span className="font-semibold">
                    {(projectGroups.reduce((acc, g) => acc + g.membersCount, 0) / projectGroups.length || 0).toFixed(
                      1,
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm">Avg CGPA</span>
                  </div>
                  <span className="font-semibold">
                    {(students.reduce((acc, s) => acc + s.cgpa, 0) / students.length || 0).toFixed(2)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions for Admin */}
        <motion.div variants={item}>
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Administrative Actions</CardTitle>
              <CardDescription>System management and configuration</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { title: "Manage Users", icon: Users, href: "/dashboard/admin/users" },
                  { title: "Project Types", icon: Settings, href: "/dashboard/admin/project-types" },
                  { title: "Staff Management", icon: UserCog, href: "/dashboard/admin/staff" },
                  { title: "View Reports", icon: BarChart3, href: "/dashboard/admin/reports" },
                ].map((action) => (
                  <Button
                    key={action.title}
                    variant="outline"
                    className="h-auto py-6 flex-col gap-3 hover:bg-primary/5 hover:border-primary/30 bg-transparent"
                    asChild
                  >
                    <Link href={action.href}>
                      <action.icon className="h-6 w-6" />
                      <span>{action.title}</span>
                    </Link>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}
