"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { FolderKanban, Calendar, Users, Clock, CheckCircle, BookOpen, FileText, ArrowRight } from "lucide-react"
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

export default function StudentDashboard() {
  const { user, projectGroups, meetings, students } = useAppStore()

  // Get the current student's data
  const currentStudent = students.find((s) => s.email === user?.email) || students[0]

  // Get groups where this student is a member
  const myGroups = projectGroups.filter((group) => group.members.some((m) => m.studentId === currentStudent?.id))

  // Get upcoming meetings for my groups
  const myMeetings = meetings
    .filter((m) => myGroups.some((g) => g.id === m.groupId) && m.status === "scheduled")
    .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime())
    .slice(0, 3)

  const stats = [
    {
      title: "My Projects",
      value: myGroups.length.toString(),
      icon: FolderKanban,
      color: "bg-primary/10 text-primary",
      description: "Active project groups",
    },
    {
      title: "Upcoming Meetings",
      value: myMeetings.length.toString(),
      icon: Calendar,
      color: "bg-warning/10 text-warning",
      description: "Scheduled this week",
    },
    {
      title: "Team Members",
      value: myGroups.reduce((acc, g) => acc + g.members.length, 0).toString(),
      icon: Users,
      color: "bg-accent/10 text-accent",
      description: "Across all projects",
    },
    {
      title: "My CGPA",
      value: currentStudent?.cgpa.toFixed(2) || "N/A",
      icon: BookOpen,
      color: "bg-success/10 text-success",
      description: "Current academic score",
    },
  ]

  return (
    <div className="min-h-screen">
      <Header
        title={`Welcome, ${user?.name?.split(" ")[0] || "Student"}!`}
        description="Track your projects, meetings, and academic progress."
      />

      <motion.div variants={container} initial="hidden" animate="show" className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <motion.div key={stat.title} variants={item}>
              <Card className="border-border/50 hover:border-primary/30 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${stat.color}`}>
                      <stat.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">{stat.value}</h3>
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* My Projects */}
          <motion.div variants={item} className="lg:col-span-2">
            <Card className="border-border/50">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>My Projects</CardTitle>
                  <CardDescription>Your active project groups and progress</CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/dashboard/student/my-projects">
                    View All
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                {myGroups.length > 0 ? (
                  <div className="space-y-4">
                    {myGroups.map((project) => (
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
                              {project.name} • Guide: {project.guideStaffName}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge
                            className={
                              project.status === "approved"
                                ? "bg-success/10 text-success border-success/30"
                                : project.status === "pending"
                                  ? "bg-warning/10 text-warning border-warning/30"
                                  : "bg-destructive/10 text-destructive border-destructive/30"
                            }
                          >
                            {project.status === "approved" && <CheckCircle className="h-3 w-3 mr-1" />}
                            {project.status === "pending" && <Clock className="h-3 w-3 mr-1" />}
                            {project.status}
                          </Badge>
                          <div className="hidden md:block w-24">
                            <Progress value={project.status === "approved" ? 75 : 30} className="h-2" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FolderKanban className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                    <p className="text-muted-foreground">You are not part of any project group yet</p>
                    <Button className="mt-4" asChild>
                      <Link href="/dashboard/student/join-group">Join a Group</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Upcoming Meetings */}
          <motion.div variants={item}>
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Upcoming Meetings</CardTitle>
                <CardDescription>Your scheduled meetings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {myMeetings.length > 0 ? (
                    myMeetings.map((meeting) => {
                      const group = projectGroups.find((g) => g.id === meeting.groupId)
                      return (
                        <div
                          key={meeting.id}
                          className="p-4 rounded-lg border border-border/50 hover:border-primary/30 transition-colors"
                        >
                          <div className="flex items-start gap-3">
                            <div className="p-2 rounded-lg bg-warning/10">
                              <Clock className="h-4 w-4 text-warning" />
                            </div>
                            <div>
                              <p className="font-medium text-sm">{meeting.purpose}</p>
                              <p className="text-xs text-muted-foreground">{group?.name}</p>
                              <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
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

        {/* Quick Actions for Students */}
        <motion.div variants={item}>
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks for students</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { title: "My Projects", icon: FolderKanban, href: "/dashboard/student/my-projects" },
                  { title: "My Meetings", icon: Calendar, href: "/dashboard/student/my-meetings" },
                  { title: "Submit Proposal", icon: FileText, href: "/dashboard/student/submit-proposal" },
                  { title: "My Profile", icon: Users, href: "/dashboard/student/profile" },
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
