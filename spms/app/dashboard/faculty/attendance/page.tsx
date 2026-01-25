"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Calendar, Users, CheckCircle, XCircle, Clock, Save } from "lucide-react"
import { Header } from "@/components/dashboard/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { useAppStore } from "@/lib/store"
import { toast } from "sonner"

export default function FacultyAttendancePage() {
  const { user, projectGroups, meetings, students, staff, updateMeeting } = useAppStore()
  const [selectedMeeting, setSelectedMeeting] = useState<string>("")
  const [attendance, setAttendance] = useState<Record<string, boolean>>({})

  const currentFaculty = staff.find((s) => s.email === user?.email) || staff[0]
  const myMeetings = meetings.filter((m) => m.guideStaffId === currentFaculty?.id && m.status === "scheduled")

  const meeting = meetings.find((m) => m.id === selectedMeeting)
  const group = meeting ? projectGroups.find((g) => g.id === meeting.groupId) : null

  const handleMeetingSelect = (meetingId: string) => {
    setSelectedMeeting(meetingId)
    const selected = meetings.find((m) => m.id === meetingId)
    if (selected) {
      const initialAttendance: Record<string, boolean> = {}
      const grp = projectGroups.find((g) => g.id === selected.groupId)
      grp?.members.forEach((member) => {
        const existing = selected.attendance.find((a) => a.studentId === member.studentId)
        initialAttendance[member.studentId] = existing?.isPresent ?? false
      })
      setAttendance(initialAttendance)
    }
  }

  const handleSaveAttendance = () => {
    if (!meeting || !group) return

    const attendanceRecords = group.members.map((member) => ({
      id: Math.random().toString(36).substr(2, 9),
      meetingId: meeting.id,
      studentId: member.studentId,
      isPresent: attendance[member.studentId] ?? false,
      remarks: "",
    }))

    updateMeeting(meeting.id, {
      attendance: attendanceRecords,
      status: "completed",
    })

    toast.success("Attendance saved successfully!")
    setSelectedMeeting("")
    setAttendance({})
  }

  const presentCount = Object.values(attendance).filter(Boolean).length
  const absentCount = Object.values(attendance).filter((v) => !v).length

  return (
    <div className="min-h-screen">
      <Header title="Mark Attendance" description="Record attendance for your project meetings" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 space-y-6">
        {/* Select Meeting */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Select Meeting</CardTitle>
            <CardDescription>Choose a scheduled meeting to mark attendance</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={selectedMeeting} onValueChange={handleMeetingSelect}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a meeting..." />
              </SelectTrigger>
              <SelectContent>
                {myMeetings.length > 0 ? (
                  myMeetings.map((m) => {
                    const grp = projectGroups.find((g) => g.id === m.groupId)
                    return (
                      <SelectItem key={m.id} value={m.id}>
                        {m.purpose} - {grp?.name} ({new Date(m.dateTime).toLocaleDateString()})
                      </SelectItem>
                    )
                  })
                ) : (
                  <SelectItem value="none" disabled>
                    No scheduled meetings
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {meeting && group && (
          <>
            {/* Meeting Info */}
            <Card className="border-border/50">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{meeting.purpose}</CardTitle>
                    <CardDescription>
                      {group.name} - {group.projectTitle}
                    </CardDescription>
                  </div>
                  <Badge className="bg-warning/10 text-warning border-warning/30">
                    <Clock className="h-3 w-3 mr-1" />
                    Scheduled
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {new Date(meeting.dateTime).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    {group.members.length} students
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Attendance Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-primary/10">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{group.members.length}</p>
                      <p className="text-sm text-muted-foreground">Total Students</p>
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
                      <p className="text-2xl font-bold">{presentCount}</p>
                      <p className="text-sm text-muted-foreground">Present</p>
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
                      <p className="text-2xl font-bold">{absentCount}</p>
                      <p className="text-sm text-muted-foreground">Absent</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Attendance List */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Mark Attendance</CardTitle>
                <CardDescription>Check the box to mark student as present</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {group.members.map((member) => {
                    const student = students.find((s) => s.id === member.studentId)
                    const isPresent = attendance[member.studentId] ?? false

                    return (
                      <div
                        key={member.id}
                        className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${
                          isPresent ? "bg-success/5 border-success/30" : "bg-muted/30 border-border/50"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <Checkbox
                            id={member.studentId}
                            checked={isPresent}
                            onCheckedChange={(checked) =>
                              setAttendance((prev) => ({
                                ...prev,
                                [member.studentId]: checked === true,
                              }))
                            }
                          />
                          <Avatar className="h-10 w-10">
                            <AvatarFallback>{student?.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{student?.name}</p>
                              {member.isGroupLeader && (
                                <Badge variant="outline" className="text-xs">
                                  Leader
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{student?.email}</p>
                          </div>
                        </div>
                        <Badge
                          className={
                            isPresent
                              ? "bg-success/10 text-success border-success/30"
                              : "bg-destructive/10 text-destructive border-destructive/30"
                          }
                        >
                          {isPresent ? (
                            <>
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Present
                            </>
                          ) : (
                            <>
                              <XCircle className="h-3 w-3 mr-1" />
                              Absent
                            </>
                          )}
                        </Badge>
                      </div>
                    )
                  })}
                </div>

                <div className="mt-6 flex justify-end">
                  <Button onClick={handleSaveAttendance}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Attendance & Complete Meeting
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {!selectedMeeting && myMeetings.length === 0 && (
          <Card className="border-border/50">
            <CardContent className="py-12">
              <div className="text-center">
                <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-lg font-semibold mb-2">No Scheduled Meetings</h3>
                <p className="text-muted-foreground">You don't have any scheduled meetings to mark attendance for.</p>
              </div>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </div>
  )
}
