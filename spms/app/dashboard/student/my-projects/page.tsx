"use client"

import { useEffect, useState } from "react"
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

export interface MyProject {
  id: number
  name: string
  projectTitle: string
  projectArea: string
  projectTypeId: number
  projectTypeName: string
  guideStaffName: string
  averageCpi: number
  projectDescription: string
  membersCount: number
  status: "approved" | "pending" | "rejected"
  isLeader: boolean
}

export default function StudentMyProjectsPage() {
  const { user } = useAppStore()

  const [myProject, setMyProject] = useState<MyProject[]>([]);
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchMyProject() {
      try {
        const res = await fetch("/api/project-groups")

        if (!res.ok) {
          throw new Error("Failed to fetch My Project")
        }
        const data: MyProject[] = await res.json()
        setMyProject(Array.isArray(data) ? data : data.data ?? [])
      } catch (error) {
        setError("Something wen wrong while loading my project")
      } finally {
        setLoading(false)
      }
    }
    fetchMyProject()
  }, [])

  // const currentStudent = students.find((s) => s.email === user?.email) || students[0]
  // const myGroups = projectGroups.filter((group) => group.members.some((m) => m.studentId === currentStudent?.id))

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

  const stats = {
    total: myProject.length,
    approved: myProject.filter((g) => g.status === "approved").length,
    pending: myProject.filter((g) => g.status === "pending").length,
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Loading projects...
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-destructive">
        {error}
      </div>
    )
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
                  <p className="text-2xl font-bold">{stats.total}</p>
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
                  <p className="text-2xl font-bold">{stats.approved}</p>
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
                  <p className="text-2xl font-bold">{stats.pending}</p>
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
            {myProject.length > 0 ? (
              <div className="space-y-4">
                {myProject.map((project) => {

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
                              {project.isLeader && (
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
                              {project.guideStaffName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-muted-foreground">Guide: {project.guideStaffName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">{project.membersCount} members</span>
                        </div>
                        <Badge variant="outline">{project.projectTypeName}</Badge>
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
