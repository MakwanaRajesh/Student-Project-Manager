"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { FolderKanban, Users, Eye, CheckCircle, Clock, XCircle, Calendar } from "lucide-react"
import { Header } from "@/components/dashboard/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAppStore } from "@/lib/store"

export default function FacultyMyGroupsPage() {
  const { user, projectGroups, students, staff, projectTypes, meetings } = useAppStore()

  const currentFaculty = staff.find((s) => s.email === user?.email) || staff[0]
  const myGroups = projectGroups.filter((g) => g.guideStaffId === currentFaculty?.id)

  return (
    <div className="min-h-screen">
      <Header title="My Guided Groups" description="Manage project groups under your guidance" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <FolderKanban className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{myGroups.length}</p>
                  <p className="text-sm text-muted-foreground">Total Groups</p>
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
                  <p className="text-2xl font-bold">{myGroups.filter((g) => g.status === "approved").length}</p>
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
                  <p className="text-2xl font-bold">{myGroups.filter((g) => g.status === "pending").length}</p>
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
                  <p className="text-2xl font-bold">{myGroups.reduce((acc, g) => acc + g.members.length, 0)}</p>
                  <p className="text-sm text-muted-foreground">Students</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Groups List */}
        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>My Guided Groups</CardTitle>
              <CardDescription>All project groups under your guidance</CardDescription>
            </div>
            <Button asChild>
              <Link href="/dashboard/faculty/schedule-meeting">Schedule Meeting</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {myGroups.length > 0 ? (
              <div className="space-y-4">
                {myGroups.map((group) => {
                  const projectType = projectTypes.find((t) => t.id === group.projectTypeId)
                  const groupMeetings = meetings.filter((m) => m.groupId === group.id)
                  const upcomingMeetings = groupMeetings.filter((m) => m.status === "scheduled").length

                  return (
                    <div
                      key={group.id}
                      className="p-6 rounded-xl border border-border/50 hover:border-primary/30 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="p-3 rounded-xl bg-primary/10">
                            <FolderKanban className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{group.projectTitle}</h3>
                            <p className="text-sm text-muted-foreground">{group.name}</p>
                            <p className="text-sm text-muted-foreground">{group.projectArea}</p>
                          </div>
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
                          {group.status === "approved" && <CheckCircle className="h-3 w-3 mr-1" />}
                          {group.status === "pending" && <Clock className="h-3 w-3 mr-1" />}
                          {group.status === "rejected" && <XCircle className="h-3 w-3 mr-1" />}
                          {group.status}
                        </Badge>
                      </div>

                      <p className="mt-4 text-sm text-muted-foreground line-clamp-2">{group.projectDescription}</p>

                      {/* Team Members */}
                      <div className="mt-4 flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">Team:</span>
                        <div className="flex -space-x-2">
                          {group.members.map((member) => {
                            const student = students.find((s) => s.id === member.studentId)
                            return (
                              <Avatar key={member.id} className="h-8 w-8 border-2 border-card">
                                <AvatarFallback className="text-xs">
                                  {student?.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                            )
                          })}
                        </div>
                        <span className="text-sm text-muted-foreground">{group.members.length} members</span>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-6 text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">{upcomingMeetings} upcoming meetings</span>
                          </div>
                          <Badge variant="outline">{projectType?.name}</Badge>
                          <span className="text-muted-foreground">Avg CPI: {group.averageCpi.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/dashboard/faculty/groups/${group.id}`}>
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <FolderKanban className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-lg font-semibold mb-2">No Groups Yet</h3>
                <p className="text-muted-foreground">You have no project groups under your guidance.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
