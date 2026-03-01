"use client"

import { motion } from "framer-motion"
import { FolderKanban, Users, CheckCircle, TrendingUp } from "lucide-react"
import { Header } from "@/components/dashboard/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useAppStore } from "@/lib/store"

export default function FacultyProjectReportsPage() {
  const { user, projectGroups, students, staff } = useAppStore()

  const currentFaculty = staff.find((s) => s.email === user?.email) || staff[0]
  const myGroups = projectGroups.filter((g) => g.guideStaffId === currentFaculty?.id)

  const approvedCount = myGroups.filter((g) => g.status === "approved").length
  const pendingCount = myGroups.filter((g) => g.status === "pending").length
  const rejectedCount = myGroups.filter((g) => g.status === "rejected").length

  const totalStudents = myGroups.reduce((acc, g) => acc + g.members.length, 0)
  const avgCgpa = myGroups.length > 0 ? myGroups.reduce((acc, g) => acc + g.averageCpi, 0) / myGroups.length : 0

  return (
    <div className="min-h-screen">
      <Header title="Project Reports" description="Overview of projects under your guidance" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <FolderKanban className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{myGroups.length}</p>
                  <p className="text-sm text-muted-foreground">Total Projects</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-success/10">
                  <CheckCircle className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{approvedCount}</p>
                  <p className="text-sm text-muted-foreground">Approved</p>
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
                  <p className="text-2xl font-bold">{totalStudents}</p>
                  <p className="text-sm text-muted-foreground">Students Guided</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-warning/10">
                  <TrendingUp className="h-6 w-6 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{avgCgpa.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">Avg CGPA</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Status Distribution */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Project Status Distribution</CardTitle>
            <CardDescription>Breakdown of project statuses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-24 text-sm">Approved</div>
                <Progress
                  value={myGroups.length > 0 ? (approvedCount / myGroups.length) * 100 : 0}
                  className="flex-1 h-3"
                />
                <div className="w-16 text-sm text-right">
                  {approvedCount} ({myGroups.length > 0 ? Math.round((approvedCount / myGroups.length) * 100) : 0}%)
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-24 text-sm">Pending</div>
                <Progress
                  value={myGroups.length > 0 ? (pendingCount / myGroups.length) * 100 : 0}
                  className="flex-1 h-3"
                />
                <div className="w-16 text-sm text-right">
                  {pendingCount} ({myGroups.length > 0 ? Math.round((pendingCount / myGroups.length) * 100) : 0}%)
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-24 text-sm">Rejected</div>
                <Progress
                  value={myGroups.length > 0 ? (rejectedCount / myGroups.length) * 100 : 0}
                  className="flex-1 h-3"
                />
                <div className="w-16 text-sm text-right">
                  {rejectedCount} ({myGroups.length > 0 ? Math.round((rejectedCount / myGroups.length) * 100) : 0}%)
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Projects List */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
            <CardDescription>All projects with their current status and progress</CardDescription>
          </CardHeader>
          <CardContent>
            {myGroups.length > 0 ? (
              <div className="space-y-4">
                {myGroups.map((group) => (
                  <div
                    key={group.id}
                    className="p-4 rounded-xl border border-border/50 hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold">{group.projectTitle}</h4>
                        <p className="text-sm text-muted-foreground">{group.name}</p>
                      </div>
                      <Badge
                        className={
                          group.status === "approved"
                            ? "bg-success/10 text-success border-success/30"
                            : group.status === "pending"
                              ? "bg-warning/10 text-warning border-warning/30"
                              : "bg-destructive/10 text-destructive border-destructive/30"
                        }
                      >
                        {group.status}
                      </Badge>
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Members</p>
                        <p className="font-medium">{group.members.length}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Avg CGPA</p>
                        <p className="font-medium">{group.averageCpi.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Area</p>
                        <p className="font-medium">{group.projectArea}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FolderKanban className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                <p className="text-muted-foreground">No projects under your guidance yet.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
