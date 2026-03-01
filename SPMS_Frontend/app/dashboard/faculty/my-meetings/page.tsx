"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Calendar, Clock, MapPin, CheckCircle, Users, Plus } from "lucide-react"
import { Header } from "@/components/dashboard/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAppStore } from "@/lib/store"

export default function FacultyMyMeetingsPage() {
  const { user, projectGroups, meetings, staff } = useAppStore()

  const currentFaculty = staff.find((s) => s.email === user?.email) || staff[0]
  const myMeetings = meetings.filter((m) => m.guideStaffId === currentFaculty?.id)

  const upcomingMeetings = myMeetings
    .filter((m) => m.status === "scheduled")
    .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime())

  const completedMeetings = myMeetings
    .filter((m) => m.status === "completed")
    .sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime())

  return (
    <div className="min-h-screen">
      <Header title="My Meetings" description="Manage your scheduled meetings" />

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
                  <p className="text-sm text-muted-foreground">Total</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Meetings */}
        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Upcoming Meetings</CardTitle>
              <CardDescription>Scheduled meetings with your groups</CardDescription>
            </div>
            <Button asChild>
              <Link href="/dashboard/faculty/schedule-meeting">
                <Plus className="h-4 w-4 mr-2" />
                Schedule Meeting
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {upcomingMeetings.length > 0 ? (
              <div className="space-y-4">
                {upcomingMeetings.map((meeting) => {
                  const group = projectGroups.find((g) => g.id === meeting.groupId)

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
                            <p className="text-sm text-muted-foreground">
                              {group?.name} - {group?.projectTitle}
                            </p>
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
                          {group?.members.length} members
                        </div>
                      </div>

                      <div className="mt-4 flex justify-end gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/dashboard/faculty/attendance/${meeting.id}`}>Mark Attendance</Link>
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <p className="text-muted-foreground">No upcoming meetings</p>
                <Button className="mt-4" asChild>
                  <Link href="/dashboard/faculty/schedule-meeting">Schedule a Meeting</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Completed Meetings */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Completed Meetings</CardTitle>
            <CardDescription>Past meetings history</CardDescription>
          </CardHeader>
          <CardContent>
            {completedMeetings.length > 0 ? (
              <div className="space-y-4">
                {completedMeetings.map((meeting) => {
                  const group = projectGroups.find((g) => g.id === meeting.groupId)
                  const attendanceCount = meeting.attendance.filter((a) => a.isPresent).length

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
                        <Badge className="bg-success/10 text-success border-success/30">Completed</Badge>
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
                          <Users className="h-4 w-4" />
                          {attendanceCount}/{group?.members.length} attended
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <p className="text-muted-foreground">No completed meetings</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
