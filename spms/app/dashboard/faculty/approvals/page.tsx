"use client"

import { motion } from "framer-motion"
import { ClipboardCheck, FolderKanban, CheckCircle, XCircle, Eye } from "lucide-react"
import { Header } from "@/components/dashboard/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAppStore } from "@/lib/store"
import { toast } from "sonner"

export default function FacultyApprovalsPage() {
  const { user, projectGroups, students, staff, projectTypes, approveProjectGroup, rejectProjectGroup } = useAppStore()

  const currentFaculty = staff.find((s) => s.email === user?.email) || staff[0]

  // Groups pending where faculty is convener or expert
  const pendingApprovals = projectGroups.filter(
    (g) =>
      g.status === "pending" && (g.convenerStaffId === currentFaculty?.id || g.expertStaffId === currentFaculty?.id),
  )

  // Groups guided by this faculty that are pending
  const guidedPending = projectGroups.filter((g) => g.status === "pending" && g.guideStaffId === currentFaculty?.id)

  const handleApprove = (groupId: string) => {
    approveProjectGroup(groupId)
    toast.success("Project approved successfully!")
  }

  const handleReject = (groupId: string) => {
    rejectProjectGroup(groupId)
    toast.success("Project rejected")
  }

  const allPending = [...new Map([...pendingApprovals, ...guidedPending].map((g) => [g.id, g])).values()]

  return (
    <div className="min-h-screen">
      <Header title="Approvals" description="Review and approve project proposals" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-warning/10">
                  <ClipboardCheck className="h-6 w-6 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{allPending.length}</p>
                  <p className="text-sm text-muted-foreground">Pending Approvals</p>
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
                  <p className="text-2xl font-bold">
                    {
                      projectGroups.filter((g) => g.status === "approved" && g.guideStaffId === currentFaculty?.id)
                        .length
                    }
                  </p>
                  <p className="text-sm text-muted-foreground">Approved by You</p>
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
                  <p className="text-2xl font-bold">
                    {
                      projectGroups.filter((g) => g.status === "rejected" && g.guideStaffId === currentFaculty?.id)
                        .length
                    }
                  </p>
                  <p className="text-sm text-muted-foreground">Rejected</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Approvals */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Pending Approvals</CardTitle>
            <CardDescription>Projects awaiting your review</CardDescription>
          </CardHeader>
          <CardContent>
            {allPending.length > 0 ? (
              <div className="space-y-4">
                {allPending.map((group) => {
                  const projectType = projectTypes.find((t) => t.id === group.projectTypeId)
                  const guide = staff.find((s) => s.id === group.guideStaffId)

                  return (
                    <div key={group.id} className="p-6 rounded-xl border border-warning/30 bg-warning/5">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="p-3 rounded-xl bg-warning/10">
                            <FolderKanban className="h-6 w-6 text-warning" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{group.projectTitle}</h3>
                            <p className="text-sm text-muted-foreground">{group.name}</p>
                            <p className="text-sm text-muted-foreground">{group.projectArea}</p>
                          </div>
                        </div>
                        <Badge className="bg-warning/10 text-warning border-warning/30">Pending Review</Badge>
                      </div>

                      <p className="mt-4 text-sm text-muted-foreground">{group.projectDescription}</p>

                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium mb-2">Team Members</p>
                          <div className="flex flex-wrap gap-2">
                            {group.members.map((member) => {
                              const student = students.find((s) => s.id === member.studentId)
                              return (
                                <div
                                  key={member.id}
                                  className="flex items-center gap-2 bg-background/50 px-3 py-1.5 rounded-lg"
                                >
                                  <Avatar className="h-6 w-6">
                                    <AvatarFallback className="text-xs">
                                      {student?.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-sm">{student?.name}</span>
                                  {member.isGroupLeader && (
                                    <Badge variant="outline" className="text-xs">
                                      Leader
                                    </Badge>
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Project Type:</span>
                            <Badge variant="outline">{projectType?.name}</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Guide:</span>
                            <span>{guide?.name}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Average CPI:</span>
                            <span className="font-medium">{group.averageCpi.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 flex items-center justify-end gap-3">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive hover:bg-destructive/10 bg-transparent"
                          onClick={() => handleReject(group.id)}
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                        <Button size="sm" onClick={() => handleApprove(group.id)}>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <ClipboardCheck className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-lg font-semibold mb-2">No Pending Approvals</h3>
                <p className="text-muted-foreground">All projects have been reviewed.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
