"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Users, FolderKanban, Calendar, TrendingUp, Clock, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { Header } from "@/components/dashboard/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useAppStore } from "@/lib/store"

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

export default function DashboardPage() {
  const router = useRouter()
  const { user, isAuthenticated, projectGroups, meetings, students, staff } = useAppStore()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    // Redirect to role-specific dashboard
    switch (user?.role) {
      case "student":
        router.push("/dashboard/student")
        break
      case "faculty":
        router.push("/dashboard/faculty")
        break
      case "admin":
        router.push("/dashboard/admin")
        break
      default:
        router.push("/login")
    }
  }, [isAuthenticated, user?.role, router])

  const stats = [
    {
      title: "Total Projects",
      value: projectGroups.length.toString(),
      change: "+12%",
      trend: "up",
      icon: FolderKanban,
      color: "bg-primary/10 text-primary",
    },
    {
      title: "Active Students",
      value: students.length.toString(),
      change: "+8%",
      trend: "up",
      icon: Users,
      color: "bg-accent/10 text-accent",
    },
    {
      title: "Upcoming Meetings",
      value: meetings.filter((m) => m.status === "scheduled").length.toString(),
      change: "+3",
      trend: "up",
      icon: Calendar,
      color: "bg-warning/10 text-warning",
    },
    {
      title: "Faculty Guides",
      value: staff.length.toString(),
      change: "0%",
      trend: "neutral",
      icon: TrendingUp,
      color: "bg-success/10 text-success",
    },
  ]

  const recentProjects = projectGroups.slice(0, 4)
  const upcomingMeetings = meetings
    .filter((m) => m.status === "scheduled")
    .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime())
    .slice(0, 3)

  return (
    <div className="min-h-screen">
      <Header
        title={`Welcome back, ${user?.name?.split(" ")[0] || "User"}!`}
        description="Here's what's happening with your projects today."
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Projects */}
          <motion.div variants={item} className="lg:col-span-2">
            <Card className="border-border/50">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Projects</CardTitle>
                  <CardDescription>Latest project activities and updates</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  View All
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
                            {project.name} • {project.projectArea}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge
                          variant={
                            project.status === "approved"
                              ? "default"
                              : project.status === "pending"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {project.status}
                        </Badge>
                        <div className="hidden md:block w-32">
                          <Progress value={project.status === "approved" ? 75 : 30} className="h-2" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Upcoming Meetings */}
          <motion.div variants={item}>
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Upcoming Meetings</CardTitle>
                <CardDescription>Scheduled meetings this week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingMeetings.length > 0 ? (
                    upcomingMeetings.map((meeting) => {
                      const group = projectGroups.find((g) => g.id === meeting.groupId)
                      return (
                        <div
                          key={meeting.id}
                          className="p-4 rounded-lg border border-border/50 hover:border-primary/30 transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-warning/10">
                                <Clock className="h-4 w-4 text-warning" />
                              </div>
                              <div>
                                <p className="font-medium text-sm">{meeting.purpose}</p>
                                <p className="text-xs text-muted-foreground">{group?.name || "Unknown Group"}</p>
                              </div>
                            </div>
                          </div>
                          <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {new Date(meeting.dateTime).toLocaleDateString("en-US", {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No upcoming meetings</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div variants={item}>
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { title: "Create Group", icon: Users, href: "/dashboard/groups/create" },
                  { title: "Schedule Meeting", icon: Calendar, href: "/dashboard/meetings/schedule" },
                  { title: "Submit Proposal", icon: FolderKanban, href: "/dashboard/projects/submit" },
                  { title: "View Reports", icon: TrendingUp, href: "/dashboard/reports/analytics" },
                ].map((action) => (
                  <Button
                    key={action.title}
                    variant="outline"
                    className="h-auto py-6 flex-col gap-3 hover:bg-primary/5 hover:border-primary/30 bg-transparent"
                    asChild
                  >
                    <a href={action.href}>
                      <action.icon className="h-6 w-6" />
                      <span>{action.title}</span>
                    </a>
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
