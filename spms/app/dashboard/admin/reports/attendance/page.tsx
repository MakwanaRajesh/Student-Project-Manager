"use client"

import { motion } from "framer-motion"
import { Calendar, Users, CheckCircle, XCircle, Percent } from "lucide-react"
import { Header } from "@/components/dashboard/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAppStore } from "@/lib/store"

export default function AdminAttendanceReportsPage() {
  const { meetings, projectGroups, students, staff } = useAppStore()

  const completedMeetings = meetings.filter((m) => m.status === "completed")
  const totalAttendance = completedMeetings.reduce((acc, m) => acc + m.attendance.length, 0)
  const totalPresent = completedMeetings.reduce((acc, m) => acc + m.attendance.filter((a) => a.isPresent).length, 0)
  const overallRate = totalAttendance > 0 ? Math.round((totalPresent / totalAttendance) * 100) : 0

  // Calculate attendance per student across all meetings
  const studentStats: Record<string, { name: string; present: number; total: number }> = {}

  completedMeetings.forEach((meeting) => {
    meeting.attendance.forEach((record) => {
      const student = students.find((s) => s.id === record.studentId)
      if (student) {
        if (!studentStats[record.studentId]) {
          studentStats[record.studentId] = { name: student.name, present: 0, total: 0 }
        }
        studentStats[record.studentId].total++
        if (record.isPresent) {
          studentStats[record.studentId].present++
        }
      }
    })
  })

  const sortedStudents = Object.entries(studentStats)
    .map(([id, data]) => ({
      id,
      ...data,
      rate: data.total > 0 ? Math.round((data.present / data.total) * 100) : 0,
    }))
    .sort((a, b) => b.rate - a.rate)

  // Faculty meeting stats
  const facultyStats = staff
    .map((s) => {
      const facultyMeetings = completedMeetings.filter((m) => m.guideStaffId === s.id)
      const total = facultyMeetings.reduce((acc, m) => acc + m.attendance.length, 0)
      const present = facultyMeetings.reduce((acc, m) => acc + m.attendance.filter((a) => a.isPresent).length, 0)
      return {
        ...s,
        meetings: facultyMeetings.length,
        total,
        present,
        rate: total > 0 ? Math.round((present / total) * 100) : 0,
      }
    })
    .filter((s) => s.meetings > 0)
    .sort((a, b) => b.meetings - a.meetings)

  return (
    <div className="min-h-screen">
      <Header title="Attendance Reports" description="System-wide attendance analysis" />

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
                  <p className="text-sm text-muted-foreground">Meetings Completed</p>
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
                  <p className="text-sm text-muted-foreground">Overall Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Attendees */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Student Attendance Rankings</CardTitle>
              <CardDescription>Students sorted by attendance rate</CardDescription>
            </CardHeader>
            <CardContent>
              {sortedStudents.length > 0 ? (
                <div className="space-y-4">
                  {sortedStudents.slice(0, 10).map((student, index) => (
                    <div key={student.id} className="flex items-center gap-4">
                      <div className="w-6 text-center text-sm font-medium text-muted-foreground">{index + 1}</div>
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">{student.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{student.name}</p>
                        <Progress value={student.rate} className="h-2 mt-1" />
                      </div>
                      <Badge
                        className={
                          student.rate >= 75
                            ? "bg-success/10 text-success border-success/30"
                            : student.rate >= 50
                              ? "bg-warning/10 text-warning border-warning/30"
                              : "bg-destructive/10 text-destructive border-destructive/30"
                        }
                      >
                        {student.rate}%
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No attendance data available</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Faculty Meeting Stats */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Faculty Meeting Summary</CardTitle>
              <CardDescription>Meetings conducted by each faculty</CardDescription>
            </CardHeader>
            <CardContent>
              {facultyStats.length > 0 ? (
                <div className="space-y-4">
                  {facultyStats.map((faculty) => (
                    <div key={faculty.id} className="p-4 rounded-lg bg-muted/30">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{faculty.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">{faculty.name}</p>
                            <p className="text-xs text-muted-foreground">{faculty.meetings} meetings</p>
                          </div>
                        </div>
                        <Badge
                          className={
                            faculty.rate >= 75
                              ? "bg-success/10 text-success border-success/30"
                              : faculty.rate >= 50
                                ? "bg-warning/10 text-warning border-warning/30"
                                : "bg-destructive/10 text-destructive border-destructive/30"
                          }
                        >
                          {faculty.rate}% attendance
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{faculty.present} present</span>
                        <span>/</span>
                        <span>{faculty.total} total</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No meeting data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  )
}
