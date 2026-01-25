"use client"

import { motion } from "framer-motion"
import { Calendar, Clock, MapPin, CheckCircle, XCircle, Users } from "lucide-react"
import { Header } from "@/components/dashboard/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAppStore } from "@/lib/store"

export default function StudentMyMeetingsPage() {
  const { user, projectGroups, meetings, students, staff } = useAppStore()

  const currentStudent = students.find((s) => s.email === user?.email) || students[0]
  const myGroups = projectGroups.filter((group) => group.members.some((m) => m.studentId === currentStudent?.id))
  const myMeetings = meetings.filter((m) => myGroups.some((g) => g.id === m.groupId))

  const upcomingMeetings = myMeetings
    .filter((m) => m.status === "scheduled")
    .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime())

  const completedMeetings = myMeetings
    .filter((m) => m.status === "completed")
    .sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime())

  return (
    <div className="min-h-screen">
      <Header title="My Meetings" description="View your scheduled and past meetings" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-warning/10">
                  <Clock className="h-6 w-6 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{upcomingMeetings.length}</p>
                  <p className="text-sm text-muted-foreground">Upcoming</p>
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
                  <p className="text-2xl font-bold">{completedMeetings.length}</p>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{myMeetings.length}</p>
                  <p className="text-sm text-muted-foreground">Total Meetings</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Meetings */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Upcoming Meetings</CardTitle>
            <CardDescription>Scheduled meetings you need to attend</CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingMeetings.length > 0 ? (
              <div className="space-y-4">
                {upcomingMeetings.map((meeting) => {
                  const group = projectGroups.find((g) => g.id === meeting.groupId)
                  const guide = staff.find((s) => s.id === meeting.guideStaffId)

                  return (
                    <div
                      key={meeting.id}
                      className="p-4 rounded-xl border border-warning/30 bg-warning/5 hover:bg-warning/10 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="p-3 rounded-lg bg-warning/10">
                            <Clock className="h-5 w-5 text-warning" />
                          </div>
                          <div>
                            <h4 className="font-medium">{meeting.purpose}</h4>
                            <p className="text-sm text-muted-foreground">{group?.name}</p>
                          </div>
                        </div>
                        <Badge className="bg-warning/10 text-warning border-warning/30">Scheduled</Badge>
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
                        <p className="mt-3 text-sm text-muted-foreground bg-background/50 p-3 rounded-lg">
                          {meeting.notes}
                        </p>
                      )}
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <p className="text-muted-foreground">No upcoming meetings scheduled</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Completed Meetings */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Past Meetings</CardTitle>
            <CardDescription>Completed meetings history</CardDescription>
          </CardHeader>
          <CardContent>
            {completedMeetings.length > 0 ? (
              <div className="space-y-4">
                {completedMeetings.map((meeting) => {
                  const group = projectGroups.find((g) => g.id === meeting.groupId)
                  const myAttendance = meeting.attendance.find((a) => a.studentId === currentStudent?.id)

                  return (
                    <div
                      key={meeting.id}
                      className="p-4 rounded-xl border border-border/50 hover:border-primary/30 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="p-3 rounded-lg bg-success/10">
                            <CheckCircle className="h-5 w-5 text-success" />
                          </div>
                          <div>
                            <h4 className="font-medium">{meeting.purpose}</h4>
                            <p className="text-sm text-muted-foreground">{group?.name}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {myAttendance?.isPresent ? (
                            <Badge className="bg-success/10 text-success border-success/30">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Present
                            </Badge>
                          ) : (
                            <Badge className="bg-destructive/10 text-destructive border-destructive/30">
                              <XCircle className="h-3 w-3 mr-1" />
                              Absent
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {new Date(meeting.dateTime).toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {meeting.location}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <p className="text-muted-foreground">No past meetings</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
