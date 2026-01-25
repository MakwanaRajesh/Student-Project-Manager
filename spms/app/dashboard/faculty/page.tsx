"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Users, FolderKanban, Calendar, TrendingUp, Clock, ClipboardCheck, UserCheck } from "lucide-react"
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

export default function FacultyDashboard() {
  const { user, projectGroups, meetings, students, staff } = useAppStore()

  // Find this faculty member
  const currentFaculty = staff.find((s) => s.email === user?.email) || staff[0]

  // Get groups where this faculty is guide
  const myGuidedGroups = projectGroups.filter((g) => g.guideStaffId === currentFaculty?.id)

  // Get groups pending approval (for convener/expert role)
  const pendingApprovals = projectGroups.filter(
    (g) =>
      g.status === "pending" && (g.convenerStaffId === currentFaculty?.id || g.expertStaffId === currentFaculty?.id),
  )

  // Get my scheduled meetings
  const myMeetings = meetings
    .filter((m) => m.guideStaffId === currentFaculty?.id && m.status === "scheduled")
    .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime())
    .slice(0, 4)

  // Students under guidance
  const studentsUnderGuidance = myGuidedGroups.reduce((acc, g) => acc + g.members.length, 0)

  const stats = [
    {
      title: "Groups Guided",
      value: myGuidedGroups.length.toString(),
      change: `${myGuidedGroups.filter((g) => g.status === "approved").length} approved`,
      icon: FolderKanban,
      color: "bg-primary/10 text-primary",
    },
    {
      title: "Students Guided",
      value: studentsUnderGuidance.toString(),
      change: "Active students",
      icon: Users,
      color: "bg-accent/10 text-accent",
    },
    {
      title: "Pending Approvals",
      value: pendingApprovals.length.toString(),
      change: "Requires action",
      icon: ClipboardCheck,
      color: "bg-warning/10 text-warning",
    },
    {
      title: "Scheduled Meetings",
      value: myMeetings.length.toString(),
      change: "This week",
      icon: Calendar,
      color: "bg-success/10 text-success",
    },
  ]

  return (
    <div className="min-h-screen">
      <Header
        title={`Welcome, ${user?.name?.split(" ")[0] || "Faculty"}!`}
        description="Manage your project groups, meetings, and student guidance."
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
                    <span className="text-sm text-muted-foreground">{stat.change}</span>
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
          {/* My Guided Projects */}
          <motion.div variants={item} className="lg:col-span-2">
            <Card className="border-border/50">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>My Guided Projects</CardTitle>
                  <CardDescription>Projects under your guidance</CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/dashboard/faculty/my-groups">View All</Link>
                </Button>
              </CardHeader>
              <CardContent>
                {myGuidedGroups.length > 0 ? (
                  <div className="space-y-4">
                    {myGuidedGroups.slice(0, 4).map((project) => (
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
                              {project.name} • {project.members.length} members
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
                            {project.status}
                          </Badge>
                          <div className="hidden md:block w-32">
                            <Progress value={project.status === "approved" ? 75 : 30} className="h-2" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <FolderKanban className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No groups under your guidance yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Upcoming Meetings */}
          <motion.div variants={item}>
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>My Meetings</CardTitle>
                <CardDescription>Scheduled project meetings</CardDescription>
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
                            <div className="flex-1">
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
                      <p>No scheduled meetings</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Pending Approvals */}
        {pendingApprovals.length > 0 && (
          <motion.div variants={item}>
            <Card className="border-border/50 border-warning/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardCheck className="h-5 w-5 text-warning" />
                  Pending Approvals
                </CardTitle>
                <CardDescription>Groups awaiting your approval as convener/expert</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingApprovals.map((group) => (
                    <div
                      key={group.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-warning/5 border border-warning/20"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-lg bg-warning/10">
                          <FolderKanban className="h-5 w-5 text-warning" />
                        </div>
                        <div>
                          <h4 className="font-medium">{group.projectTitle}</h4>
                          <p className="text-sm text-muted-foreground">{group.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/dashboard/faculty/approvals/${group.id}`}>Review</Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Quick Actions for Faculty */}
        <motion.div variants={item}>
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks for faculty</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { title: "My Groups", icon: FolderKanban, href: "/dashboard/faculty/my-groups" },
                  { title: "Schedule Meeting", icon: Calendar, href: "/dashboard/faculty/schedule-meeting" },
                  { title: "Mark Attendance", icon: UserCheck, href: "/dashboard/faculty/attendance" },
                  { title: "View Reports", icon: TrendingUp, href: "/dashboard/faculty/reports" },
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
