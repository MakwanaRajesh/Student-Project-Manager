"use client"

import { motion } from "framer-motion"
import { Calendar, CheckCircle, XCircle, Percent } from "lucide-react"
import { Header } from "@/components/dashboard/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useAppStore } from "@/lib/store"

export default function AdminAttendancePage() {
  const { meetings, projectGroups, students, staff } = useAppStore()

  const completedMeetings = meetings.filter((m) => m.status === "completed")
  const totalAttendance = completedMeetings.reduce((acc, m) => acc + m.attendance.length, 0)
  const totalPresent = completedMeetings.reduce((acc, m) => acc + m.attendance.filter((a) => a.isPresent).length, 0)
  const overallRate = totalAttendance > 0 ? Math.round((totalPresent / totalAttendance) * 100) : 0

  // Group attendance by project
  const projectAttendance = projectGroups
    .map((group) => {
      const groupMeetings = completedMeetings.filter((m) => m.groupId === group.id)
      const total = groupMeetings.reduce((acc, m) => acc + m.attendance.length, 0)
      const present = groupMeetings.reduce((acc, m) => acc + m.attendance.filter((a) => a.isPresent).length, 0)
      const rate = total > 0 ? Math.round((present / total) * 100) : 0
      return { group, meetings: groupMeetings.length, total, present, rate }
    })
    .filter((p) => p.meetings > 0)

  return (
    <div className="min-h-screen">
      <Header title="Attendance Overview" description="System-wide attendance statistics" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{completedMeetings.length}</p>
                  <p className="text-sm text-muted-foreground">Completed Meetings</p>
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
                  <p className="text-2xl font-bold">{totalPresent}</p>
                  <p className="text-sm text-muted-foreground">Total Present</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-destructive/10">
                  <XCircle className="h-6 w-6 text-destructive" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalAttendance - totalPresent}</p>
                  <p className="text-sm text-muted-foreground">Total Absent</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-warning/10">
                  <Percent className="h-6 w-6 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{overallRate}%</p>
                  <p className="text-sm text-muted-foreground">Overall Attendance</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Project-wise Attendance */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Project-wise Attendance</CardTitle>
            <CardDescription>Attendance rates by project group</CardDescription>
          </CardHeader>
          <CardContent>
            {projectAttendance.length > 0 ? (
              <div className="space-y-4">
                {projectAttendance
                  .sort((a, b) => b.rate - a.rate)
                  .map(({ group, meetings, total, present, rate }) => (
                    <div key={group.id} className="p-4 rounded-xl border border-border/50">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-medium">{group.projectTitle}</h4>
                          <p className="text-sm text-muted-foreground">{group.name}</p>
                        </div>
                        <Badge
                          className={
                            rate >= 75
                              ? "bg-success/10 text-success border-success/30"
                              : rate >= 50
                                ? "bg-warning/10 text-warning border-warning/30"
                                : "bg-destructive/10 text-destructive border-destructive/30"
                          }
                        >
                          {rate}%
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4">
                        <Progress value={rate} className="flex-1 h-2" />
                        <span className="text-sm text-muted-foreground">
                          {present}/{total} ({meetings} meetings)
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                <p className="text-muted-foreground">No attendance records yet.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
