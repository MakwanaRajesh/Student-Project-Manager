"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { FolderKanban, Users, Clock, CheckCircle, XCircle, Eye } from "lucide-react"
import { Header } from "@/components/dashboard/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAppStore } from "@/lib/store"
import { toast } from "sonner"

interface ProjectGroup {
  id: number
  name: string
  projectTitle: string
  projectArea: string
  projectDescription: string
  projectTypeId: number
  projectTypeName: string
  guideStaffName: string
  averageCpi: number
  membersCount: number
  guideStaffId: number
  status: "pending" | "approved" | "rejected"
}

export default function AdminApprovalsPage() {
  // const { students, staff, projectTypes, approveProjectGroup, rejectProjectGroup } = useAppStore()
  const { staff, projectTypes } = useAppStore()

  const [projectGroups, setProjectGroups] = useState<ProjectGroup[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch("/api/project-groups")
        const data = await res.json()
        setProjectGroups(data)
      } catch {
        toast.error("Failed to load projects")
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  const pendingGroups = projectGroups.filter(
    (g) => g.status === "pending"
  )

  const handleApprove = async (id: number) => {
    try {
      const res = await fetch(`/api/project-groups/${id}/approve`, {
        method: "PATCH",
      })

      if (!res.ok) throw new Error()

      setProjectGroups((prev) =>
        prev.map((g) =>
          g.id === id ? { ...g, status: "approved" } : g
        )
      )

      toast.success("Project approved successfully")
    } catch {
      toast.error("Failed to approve project")
    }
  }

  const handleReject = async (id: number) => {
    try {
      const res = await fetch(`/api/project-groups/${id}/reject`, {
        method: "PATCH",
      })

      if (!res.ok) throw new Error()

      setProjectGroups((prev) =>
        prev.map((g) =>
          g.id === id ? { ...g, status: "rejected" } : g
        )
      )

      toast.success("Project rejected")
    } catch {
      toast.error("Failed to reject project")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header title="Pending Approvals" description="Review and approve project proposals" />
        <div className="p-6">Loading projects...</div>
      </div>
    )
  }


  return (
    <div className="min-h-screen">
      <Header title="Pending Approvals" description="Review and approve project proposals" />

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
                  <p className="text-2xl font-bold">{pendingGroups.length}</p>
                  <p className="text-sm text-muted-foreground">Pending</p>
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
                  <p className="text-2xl font-bold">{projectGroups.filter((g) => g.status === "approved").length}</p>
                  <p className="text-sm text-muted-foreground">Approved</p>
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
                  <p className="text-2xl font-bold">{projectGroups.filter((g) => g.status === "rejected").length}</p>
                  <p className="text-sm text-muted-foreground">Rejected</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending List */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Pending Approvals ({pendingGroups.length})</CardTitle>
            <CardDescription>Projects waiting for approval</CardDescription>
          </CardHeader>
          <CardContent>
            {pendingGroups.length > 0 ? (
              <div className="space-y-4">
                {pendingGroups.map((group) => {
                  // const guide = staff.find((s) => s.id === group.guideStaffId)
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">
                      {group.guideStaffName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  const projectType = projectTypes.find((t) => t.id === group.projectTypeId)

                  return (
                    <div key={group.id} className="p-6 rounded-xl border border-warning/30 bg-warning/5">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="p-3 rounded-xl bg-warning/10">
                            <FolderKanban className="h-6 w-6 text-warning" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{group.projectTitle}</h3>
                            <p className="text-sm text-muted-foreground mt-1">{group.name}</p>
                            <p className="text-sm text-muted-foreground">{group.projectArea}</p>
                          </div>
                        </div>
                        <Badge className="bg-warning/10 text-warning border-warning/30">
                          <Clock className="h-3 w-3 mr-1" />
                          Pending
                        </Badge>
                      </div>

                      <p className="mt-4 text-sm text-muted-foreground line-clamp-2">{group.projectDescription}</p>

                      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
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
                          <span className="text-muted-foreground">{group.members.length} members</span>
                        </div>
                        <Badge variant="outline">{projectType?.name}</Badge>
                        <Badge variant="outline">Avg CGPA: {group.averageCpi.toFixed(2)}</Badge>
                      </div>

                      <div className="mt-4 flex items-center justify-end gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/dashboard/admin/approvals/${group.id}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Link>
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
                        <Button
                          size="sm"
                          className="bg-success hover:bg-success/90"
                          onClick={() => handleApprove(group.id)}
                        >
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
                <CheckCircle className="h-16 w-16 mx-auto mb-4 text-success/50" />
                <h3 className="text-lg font-semibold mb-2">All Caught Up!</h3>
                <p className="text-muted-foreground">No pending approvals at the moment.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
