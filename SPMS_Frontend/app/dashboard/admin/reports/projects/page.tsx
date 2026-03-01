"use client"

import { motion } from "framer-motion"
import { FolderKanban, Users, CheckCircle, Clock, TrendingUp } from "lucide-react"
import { Header } from "@/components/dashboard/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useAppStore } from "@/lib/store"

export default function AdminProjectReportsPage() {
  const { projectGroups, students, staff, projectTypes } = useAppStore()

  const approvedCount = projectGroups.filter((g) => g.status === "approved").length
  const pendingCount = projectGroups.filter((g) => g.status === "pending").length
  const rejectedCount = projectGroups.filter((g) => g.status === "rejected").length
  const totalStudents = projectGroups.reduce((acc, g) => acc + g.members.length, 0)
  const avgCgpa =
    projectGroups.length > 0 ? projectGroups.reduce((acc, g) => acc + g.averageCpi, 0) / projectGroups.length : 0

  // Group by project type
  const projectsByType = projectTypes.map((type) => {
    const count = projectGroups.filter((g) => g.projectTypeId === type.id).length
    return { type, count }
  })

  // Group by guide
  const projectsByGuide = staff
    .map((s) => {
      const count = projectGroups.filter((g) => g.guideStaffId === s.id).length
      return { guide: s, count }
    })
    .filter((g) => g.count > 0)
    .sort((a, b) => b.count - a.count)

  return (
    <div className="min-h-screen">
      <Header title="Project Reports" description="Comprehensive project analysis" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
                <div className="p-3 rounded-xl bg-warning/10">
                  <Clock className="h-6 w-6 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{pendingCount}</p>
                  <p className="text-sm text-muted-foreground">Pending</p>
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
                  <p className="text-sm text-muted-foreground">Students</p>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Status Distribution */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Status Distribution</CardTitle>
              <CardDescription>Breakdown of project statuses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-24 text-sm">Approved</div>
                  <Progress
                    value={projectGroups.length > 0 ? (approvedCount / projectGroups.length) * 100 : 0}
                    className="flex-1 h-3"
                  />
                  <div className="w-20 text-sm text-right">
                    {approvedCount} (
                    {projectGroups.length > 0 ? Math.round((approvedCount / projectGroups.length) * 100) : 0}%)
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-24 text-sm">Pending</div>
                  <Progress
                    value={projectGroups.length > 0 ? (pendingCount / projectGroups.length) * 100 : 0}
                    className="flex-1 h-3"
                  />
                  <div className="w-20 text-sm text-right">
                    {pendingCount} (
                    {projectGroups.length > 0 ? Math.round((pendingCount / projectGroups.length) * 100) : 0}%)
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-24 text-sm">Rejected</div>
                  <Progress
                    value={projectGroups.length > 0 ? (rejectedCount / projectGroups.length) * 100 : 0}
                    className="flex-1 h-3"
                  />
                  <div className="w-20 text-sm text-right">
                    {rejectedCount} (
                    {projectGroups.length > 0 ? Math.round((rejectedCount / projectGroups.length) * 100) : 0}%)
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Projects by Type */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Projects by Type</CardTitle>
              <CardDescription>Distribution across project types</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {projectsByType.map(({ type, count }) => (
                  <div key={type.id} className="flex items-center gap-4">
                    <div className="w-32 text-sm truncate">{type.name}</div>
                    <Progress
                      value={projectGroups.length > 0 ? (count / projectGroups.length) * 100 : 0}
                      className="flex-1 h-3"
                    />
                    <div className="w-16 text-sm text-right">{count}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Projects by Guide */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Projects by Guide</CardTitle>
            <CardDescription>Number of projects per faculty guide</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projectsByGuide.map(({ guide, count }) => (
                <div key={guide.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/30">
                  <div className="flex-1">
                    <p className="font-medium">{guide.name}</p>
                    <p className="text-sm text-muted-foreground">{guide.description}</p>
                  </div>
                  <Badge variant="outline">{count} projects</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
