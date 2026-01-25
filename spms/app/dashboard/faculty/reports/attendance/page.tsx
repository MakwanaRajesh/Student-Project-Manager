"use client"

import { motion } from "framer-motion"
import { Calendar, Users, CheckCircle, XCircle, Percent } from "lucide-react"
import { Header } from "@/components/dashboard/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAppStore } from "@/lib/store"

export default function FacultyAttendanceReportsPage() {
  const { user, projectGroups, meetings, students, staff } = useAppStore()

  const currentFaculty = staff.find((s) => s.email === user?.email) || staff[0]
  const myGroups = projectGroups.filter((g) => g.guideStaffId === currentFaculty?.id)
  const myMeetings = meetings.filter((m) => m.guideStaffId === currentFaculty?.id)
  const completedMeetings = myMeetings.filter((m) => m.status === "completed")

  // Calculate attendance stats per student
  const studentAttendance: Record<string, { present: number; total: number; name: string }> = {}

  myGroups.forEach((group) => {
    group.members.forEach((member) => {
      const student = students.find((s) => s.id === member.studentId)
      if (student && !studentAttendance[member.studentId]) {
        studentAttendance[member.studentId] = { present: 0, total: 0, name: student.name }
      }
    })
  })

  completedMeetings.forEach((meeting) => {
    const group = myGroups.find((g) => g.id === meeting.groupId)
    if (group) {
      group.members.forEach((member) => {
        if (studentAttendance[member.studentId]) {
          studentAttendance[member.studentId].total++
          const attended = meeting.attendance.find((a) => a.studentId === member.studentId && a.isPresent)
          if (attended) {
            studentAttendance[member.studentId].present++
          }
        }
      })
    }
  })

  const totalAttendanceRecords = completedMeetings.reduce((acc, m) => acc + m.attendance.length, 0)
  const totalPresent = completedMeetings.reduce((acc, m) => acc + m.attendance.filter((a) => a.isPresent).length, 0)
  const overallRate = totalAttendanceRecords > 0 ? Math.round((totalPresent / totalAttendanceRecords) * 100) : 0

  return (
    <div className="min-h-screen">
      <Header title="Attendance Reports" description="Student attendance analysis for your projects" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{completedMeetings.length}</p>
                  <p className="text-sm text-muted-foreground">Total Meetings</p>
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
                  <p className="text-2xl font-bold">{totalAttendanceRecords - totalPresent}</p>
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
                  <p className="text-sm text-muted-foreground">Overall Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Student-wise Attendance */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Student Attendance Summary</CardTitle>
            <CardDescription>Individual attendance records for students under your guidance</CardDescription>
          </CardHeader>
          <CardContent>
            {Object.keys(studentAttendance).length > 0 ? (
              <div className="space-y-4">
                {Object.entries(studentAttendance).map(([studentId, data]) => {
                  const rate = data.total > 0 ? Math.round((data.present / data.total) * 100) : 0
                  const student = students.find((s) => s.id === studentId)

                  return (
                    <div key={studentId} className="flex items-center gap-4 p-4 rounded-xl border border-border/50">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>{data.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium">{data.name}</p>
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
                            {data.present}/{data.total} meetings
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                <p className="text-muted-foreground">No attendance records available yet.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Meeting-wise Attendance */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Meeting Attendance History</CardTitle>
            <CardDescription>Attendance records for each completed meeting</CardDescription>
          </CardHeader>
          <CardContent>
            {completedMeetings.length > 0 ? (
              <div className="space-y-4">
                {completedMeetings.map((meeting) => {
                  const group = myGroups.find((g) => g.id === meeting.groupId)
                  const presentCount = meeting.attendance.filter((a) => a.isPresent).length
                  const totalCount = meeting.attendance.length
                  const rate = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0

                  return (
                    <div key={meeting.id} className="p-4 rounded-xl border border-border/50">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium">{meeting.purpose}</h4>
                          <p className="text-sm text-muted-foreground">{group?.name}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(meeting.dateTime).toLocaleDateString("en-US", {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge
                            className={
                              rate >= 75
                                ? "bg-success/10 text-success border-success/30"
                                : rate >= 50
                                  ? "bg-warning/10 text-warning border-warning/30"
                                  : "bg-destructive/10 text-destructive border-destructive/30"
                            }
                          >
                            {rate}% attendance
                          </Badge>
                          <p className="text-sm text-muted-foreground mt-1">
                            {presentCount}/{totalCount} present
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                <p className="text-muted-foreground">No completed meetings yet.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
