"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { FolderKanban, Users, Eye, CheckCircle, Clock, XCircle } from "lucide-react"
import { Header } from "@/components/dashboard/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAppStore } from "@/lib/store"

export default function StudentMyProjectsPage() {
  const { user, projectGroups, students, staff, projectTypes } = useAppStore()

  const currentStudent = students.find((s) => s.email === user?.email) || students[0]
  const myGroups = projectGroups.filter((group) => group.members.some((m) => m.studentId === currentStudent?.id))

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-success" />
      case "pending":
        return <Clock className="h-4 w-4 text-warning" />
      case "rejected":
        return <XCircle className="h-4 w-4 text-destructive" />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen">
      <Header title="My Projects" description="View and manage your project groups" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <FolderKanban className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{myGroups.length}</p>
                  <p className="text-sm text-muted-foreground">Total Projects</p>
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
        </div>

        {/* Projects List */}
        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>My Project Groups</CardTitle>
              <CardDescription>All projects you are a member of</CardDescription>
            </div>
            <Button asChild>
              <Link href="/dashboard/student/submit-proposal">Submit New Proposal</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {myGroups.length > 0 ? (
              <div className="space-y-4">
                {myGroups.map((project) => {
                  const guide = staff.find((s) => s.id === project.guideStaffId)
                  const projectType = projectTypes.find((t) => t.id === project.projectTypeId)
                  const isLeader = project.members.some((m) => m.studentId === currentStudent?.id && m.isGroupLeader)

                  return (
                    <div
                      key={project.id}
                      className="p-6 rounded-xl border border-border/50 hover:border-primary/30 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="p-3 rounded-xl bg-primary/10">
                            <FolderKanban className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-lg">{project.projectTitle}</h3>
                              {isLeader && (
                                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                                  Leader
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{project.name}</p>
                            <p className="text-sm text-muted-foreground">{project.projectArea}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(project.status)}
                          <Badge
                            className={
                              project.status === "approved"
                                ? "bg-success/10 text-success border-success/30"
                                : project.status === "pending"
                                  ? "bg-warning/10 text-warning border-warning/30"
                                  : "bg-destructive/10 text-destructive border-destructive/30"
                            }
                          >
                            {project.status}
                          </Badge>
                        </div>
                      </div>

                      <p className="mt-4 text-sm text-muted-foreground">{project.projectDescription}</p>

                      <div className="mt-4 flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">
                              {guide?.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-muted-foreground">Guide: {guide?.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">{project.members.length} members</span>
                        </div>
                        <Badge variant="outline">{projectType?.name}</Badge>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">Progress:</span>
                          <Progress value={project.status === "approved" ? 75 : 30} className="w-32 h-2" />
                          <span className="text-sm font-medium">{project.status === "approved" ? "75%" : "30%"}</span>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/dashboard/student/projects/${project.id}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Link>
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <FolderKanban className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-lg font-semibold mb-2">No Projects Yet</h3>
                <p className="text-muted-foreground mb-4">You are not part of any project group yet.</p>
                <Button asChild>
                  <Link href="/dashboard/student/submit-proposal">Submit a Proposal</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
