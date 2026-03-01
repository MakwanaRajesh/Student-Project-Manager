"use client"

import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { FolderKanban, Calendar, ArrowLeft, CheckCircle, Clock, MapPin } from "lucide-react"
import { Header } from "@/components/dashboard/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { useAppStore } from "@/lib/store"

export default function StudentProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { projectGroups, students, staff, projectTypes, meetings } = useAppStore()

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
  const convener = staff.find((s) => s.id === project.convenerStaffId)
  const expert = staff.find((s) => s.id === project.expertStaffId)
  const projectType = projectTypes.find((t) => t.id === project.projectTypeId)
  const projectMeetings = meetings.filter((m) => m.groupId === project.id)

  return (
    <div className="min-h-screen">
      <Header title={project.projectTitle} description={`${project.name} - ${project.projectArea}`} />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 space-y-6">
        {/* Back Button */}
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Projects
        </Button>

        {/* Project Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Main Info */}
            <Card className="border-border/50">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl">{project.projectTitle}</CardTitle>
                    <CardDescription className="mt-2">{project.name}</CardDescription>
                  </div>
                  <Badge
                    className={
                      project.status === "approved"
                        ? "bg-success/10 text-success border-success/30"
                        : project.status === "pending"
                          ? "bg-warning/10 text-warning border-warning/30"
                          : "bg-destructive/10 text-destructive border-destructive/30"
                    }
                  >
                    {project.status === "approved" && <CheckCircle className="h-3 w-3 mr-1" />}
                    {project.status === "pending" && <Clock className="h-3 w-3 mr-1" />}
                    {project.status}
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
                    <p className="text-sm text-muted-foreground">Team Size</p>
                    <p className="font-medium">{project.members.length} members</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-3">Progress</h4>
                  <div className="flex items-center gap-4">
                    <Progress value={project.status === "approved" ? 75 : 30} className="flex-1" />
                    <span className="font-medium">{project.status === "approved" ? "75%" : "30%"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Team Members */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Team Members</CardTitle>
                <CardDescription>People working on this project</CardDescription>
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

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Faculty */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Faculty</CardTitle>
                <CardDescription>Assigned faculty members</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {guide && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {guide.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{guide.name}</p>
                      <p className="text-xs text-muted-foreground">Project Guide</p>
                    </div>
                  </div>
                )}
                {convener && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>{convener.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{convener.name}</p>
                      <p className="text-xs text-muted-foreground">Convener</p>
                    </div>
                  </div>
                )}
                {expert && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>{expert.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{expert.name}</p>
                      <p className="text-xs text-muted-foreground">Expert</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Upcoming Meetings */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Meetings</CardTitle>
                <CardDescription>Project meetings</CardDescription>
              </CardHeader>
              <CardContent>
                {projectMeetings.length > 0 ? (
                  <div className="space-y-3">
                    {projectMeetings.slice(0, 3).map((meeting) => (
                      <div key={meeting.id} className="p-3 rounded-lg border border-border/50">
                        <p className="font-medium text-sm">{meeting.purpose}</p>
                        <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {new Date(meeting.dateTime).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                        <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {meeting.location}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No meetings scheduled</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
