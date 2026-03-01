"use client"

import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { FolderKanban, Users, ArrowLeft, CheckCircle, XCircle, BookOpen, Clock } from "lucide-react"
import { Header } from "@/components/dashboard/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { useAppStore } from "@/lib/store"
import { toast } from "sonner"
import { useState } from "react"

export default function FacultyApprovalDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { projectGroups, students, staff, projectTypes, approveProjectGroup, rejectProjectGroup } = useAppStore()
  const [remarks, setRemarks] = useState("")

  const project = projectGroups.find((p) => p.id === params.id)

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FolderKanban className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
          <h2 className="text-xl font-semibold mb-2">Project Not Found</h2>
          <p className="text-muted-foreground mb-4">The project you are looking for does not exist.</p>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    )
  }

  const guide = staff.find((s) => s.id === project.guideStaffId)
  const projectType = projectTypes.find((t) => t.id === project.projectTypeId)

  const handleApprove = () => {
    approveProjectGroup(project.id)
    toast.success("Project approved successfully!")
    router.push("/dashboard/faculty/approvals")
  }

  const handleReject = () => {
    rejectProjectGroup(project.id)
    toast.error("Project rejected")
    router.push("/dashboard/faculty/approvals")
  }

  return (
    <div className="min-h-screen">
      <Header title="Review Project" description="Review and approve or reject this project proposal" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 space-y-6">
        {/* Back Button */}
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Approvals
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Project Info */}
            <Card className="border-border/50">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl">{project.projectTitle}</CardTitle>
                    <CardDescription className="mt-2">{project.name}</CardDescription>
                  </div>
                  <Badge className="bg-warning/10 text-warning border-warning/30">
                    <Clock className="h-3 w-3 mr-1" />
                    Pending Review
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium mb-2">Project Description</h4>
                  <p className="text-muted-foreground">{project.projectDescription}</p>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Project Type</p>
                    <p className="font-medium">{projectType?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Project Area</p>
                    <p className="font-medium">{project.projectArea}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Average CGPA</p>
                    <p className="font-medium">{project.averageCpi.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Guide</p>
                    <p className="font-medium">{guide?.name}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Team Members */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Team Members</CardTitle>
                <CardDescription>Students in this project group</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {project.members.map((member) => {
                    const student = students.find((s) => s.id === member.studentId)
                    return (
                      <div key={member.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback>{student?.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{student?.name}</p>
                              {member.isGroupLeader && (
                                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                                  Leader
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{student?.email}</p>
                            <p className="text-xs text-muted-foreground">{student?.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{member.cgpa.toFixed(2)}</p>
                          <p className="text-sm text-muted-foreground">CGPA</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Approval Actions */}
          <div className="space-y-6">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Review Decision</CardTitle>
                <CardDescription>Approve or reject this project proposal</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Remarks (Optional)</label>
                  <Textarea
                    placeholder="Add any comments or feedback..."
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Button onClick={handleApprove} className="w-full bg-success hover:bg-success/90">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve Project
                  </Button>
                  <Button onClick={handleReject} variant="destructive" className="w-full">
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject Project
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm">Team Size</span>
                  </div>
                  <span className="font-semibold">{project.members.length}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm">Avg CGPA</span>
                  </div>
                  <span className="font-semibold">{project.averageCpi.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
