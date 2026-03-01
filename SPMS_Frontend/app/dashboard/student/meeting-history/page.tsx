"use client"

import { motion } from "framer-motion"
import { Calendar, MapPin, CheckCircle, XCircle, Users, History } from "lucide-react"
import { Header } from "@/components/dashboard/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAppStore } from "@/lib/store"

export default function StudentMeetingHistoryPage() {
  const { user, projectGroups, meetings, students, staff } = useAppStore()

  const currentStudent = students.find((s) => s.email === user?.email) || students[0]
  const myGroups = projectGroups.filter((group) => group.members.some((m) => m.studentId === currentStudent?.id))
  const allMeetings = meetings
    .filter((m) => myGroups.some((g) => g.id === m.groupId))
    .sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime())

  const attendedCount = allMeetings.filter((m) =>
    m.attendance.some((a) => a.studentId === currentStudent?.id && a.isPresent),
  ).length

  const completedMeetings = allMeetings.filter((m) => m.status === "completed")
  const attendanceRate = completedMeetings.length > 0 ? Math.round((attendedCount / completedMeetings.length) * 100) : 0

  return (
    <div className="min-h-screen">
      <Header title="Meeting History" description="Complete history of all your project meetings" />

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
                  <p className="text-2xl font-bold">{allMeetings.length}</p>
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
                  <p className="text-2xl font-bold">{attendedCount}</p>
                  <p className="text-sm text-muted-foreground">Attended</p>
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
                  <p className="text-2xl font-bold">{completedMeetings.length - attendedCount}</p>
                  <p className="text-sm text-muted-foreground">Missed</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-warning/10">
                  <History className="h-6 w-6 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{attendanceRate}%</p>
                  <p className="text-sm text-muted-foreground">Attendance Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* All Meetings */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Complete Meeting History</CardTitle>
            <CardDescription>All meetings across your project groups</CardDescription>
          </CardHeader>
          <CardContent>
            {allMeetings.length > 0 ? (
              <div className="space-y-4">
                {allMeetings.map((meeting) => {
                  const group = projectGroups.find((g) => g.id === meeting.groupId)
                  const guide = staff.find((s) => s.id === meeting.guideStaffId)
                  const myAttendance = meeting.attendance.find((a) => a.studentId === currentStudent?.id)

                  return (
                    <div
                      key={meeting.id}
                      className="p-4 rounded-xl border border-border/50 hover:border-primary/30 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div
                            className={`p-3 rounded-lg ${
                              meeting.status === "completed"
                                ? "bg-success/10"
                                : meeting.status === "scheduled"
                                  ? "bg-warning/10"
                                  : "bg-muted"
                            }`}
                          >
                            <Calendar
                              className={`h-5 w-5 ${
                                meeting.status === "completed"
                                  ? "text-success"
                                  : meeting.status === "scheduled"
                                    ? "text-warning"
                                    : "text-muted-foreground"
                              }`}
                            />
                          </div>
                          <div>
                            <h4 className="font-medium">{meeting.purpose}</h4>
                            <p className="text-sm text-muted-foreground">{group?.name}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {meeting.status === "completed" && myAttendance ? (
                            myAttendance.isPresent ? (
                              <Badge className="bg-success/10 text-success border-success/30">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Present
                              </Badge>
                            ) : (
                              <Badge className="bg-destructive/10 text-destructive border-destructive/30">
                                <XCircle className="h-3 w-3 mr-1" />
                                Absent
                              </Badge>
                            )
                          ) : (
                            <Badge
                              className={
                                meeting.status === "scheduled"
                                  ? "bg-warning/10 text-warning border-warning/30"
                                  : "bg-muted text-muted-foreground"
                              }
                            >
                              {meeting.status}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {new Date(meeting.dateTime).toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {meeting.location}
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          Guide: {guide?.name}
                        </div>
                      </div>

                      {meeting.notes && (
                        <p className="mt-3 text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">{meeting.notes}</p>
                      )}
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <History className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-lg font-semibold mb-2">No Meeting History</h3>
                <p className="text-muted-foreground">You don't have any meeting records yet.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
