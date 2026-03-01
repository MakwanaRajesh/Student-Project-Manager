"use client"

import { motion } from "framer-motion"
import { BarChart3, TrendingUp, Users, FolderKanban, Calendar, Award } from "lucide-react"
import { Header } from "@/components/dashboard/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useAppStore } from "@/lib/store"

export default function AdminAnalyticsPage() {
  const { projectGroups, students, staff, meetings, projectTypes } = useAppStore()

  const approvedProjects = projectGroups.filter((g) => g.status === "approved")
  const pendingProjects = projectGroups.filter((g) => g.status === "pending")
  const completedMeetings = meetings.filter((m) => m.status === "completed")
  const avgCgpa = students.length > 0 ? students.reduce((acc, s) => acc + s.cgpa, 0) / students.length : 0

  const projectsByType = projectTypes.map((type) => ({
    type: type.name,
    count: projectGroups.filter((g) => g.projectTypeId === type.id).length,
  }))

  const facultyWorkload = staff.map((s) => ({
    name: s.name,
    groups: projectGroups.filter((g) => g.guideStaffId === s.id).length,
    students: projectGroups.filter((g) => g.guideStaffId === s.id).reduce((acc, g) => acc + g.members.length, 0),
  }))

  return (
    <div className="min-h-screen">
      <Header title="Analytics" description="System-wide analytics and reports" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <FolderKanban className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{projectGroups.length}</p>
                  <p className="text-sm text-muted-foreground">Total Projects</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-accent/10">
                  <Users className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{students.length}</p>
                  <p className="text-sm text-muted-foreground">Total Students</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-success/10">
                  <Calendar className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{completedMeetings.length}</p>
                  <p className="text-sm text-muted-foreground">Meetings Held</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-warning/10">
                  <Award className="h-6 w-6 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{avgCgpa.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">Average CGPA</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Project Status Distribution */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Project Status Distribution
              </CardTitle>
              <CardDescription>Overview of project approval status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Approved</span>
                  <span className="font-medium text-success">{approvedProjects.length}</span>
                </div>
                <Progress
                  value={projectGroups.length > 0 ? (approvedProjects.length / projectGroups.length) * 100 : 0}
                  className="h-2"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Pending</span>
                  <span className="font-medium text-warning">{pendingProjects.length}</span>
                </div>
                <Progress
                  value={projectGroups.length > 0 ? (pendingProjects.length / projectGroups.length) * 100 : 0}
                  className="h-2"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Rejected</span>
                  <span className="font-medium text-destructive">
                    {projectGroups.length - approvedProjects.length - pendingProjects.length}
                  </span>
                </div>
                <Progress
                  value={
                    projectGroups.length > 0
                      ? ((projectGroups.length - approvedProjects.length - pendingProjects.length) /
                          projectGroups.length) *
                        100
                      : 0
                  }
                  className="h-2"
                />
              </div>
            </CardContent>
          </Card>

          {/* Projects by Type */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Projects by Type
              </CardTitle>
              <CardDescription>Distribution across project categories</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {projectsByType.map((item) => (
                <div key={item.type} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>{item.type}</span>
                    <span className="font-medium">{item.count}</span>
                  </div>
                  <Progress
                    value={projectGroups.length > 0 ? (item.count / projectGroups.length) * 100 : 0}
                    className="h-2"
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Faculty Workload */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Faculty Workload</CardTitle>
            <CardDescription>Groups and students per faculty guide</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {facultyWorkload.map((faculty) => (
                <div key={faculty.name} className="p-4 rounded-xl bg-muted/30">
                  <p className="font-medium">{faculty.name}</p>
                  <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{faculty.groups} groups</span>
                    <span>{faculty.students} students</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
