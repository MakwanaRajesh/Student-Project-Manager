"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import {
  FolderKanban,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
} from "lucide-react"

import { Header } from "@/components/dashboard/header"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { toast } from "sonner"

/* =======================
   Types (MATCH API)
======================= */
interface ProjectGroup {
  ProjectGroupID: number
  ProjectGroupName: string
  ProjectTitle: string | null
  ProjectArea: string | null
  ProjectTypeID: number
  ProjectTypeName: string
  GuideStaffName: string | null
  AverageCPI: number | null
  MembersCount: number
  // status: string
  Status: "pending" | "approved" | "rejected"
  Description: string | null
}

export default function AdminApprovalsPage() {
  const [projectGroups, setProjectGroups] = useState<ProjectGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  /* =======================
     FETCH FROM YOUR API
  ======================= */
  useEffect(() => {
    const fetchProjectGroups = async () => {
      try {
        const res = await fetch("/api/project-groups")
        if (!res.ok) throw new Error("API error")
        const data = await res.json()

        const normalized = data.map((g: any) => ({
          ...g,
          averageCpi: Number(g.averageCpi) || 0,
        }))

        setProjectGroups(normalized)

      } catch (err) {
        setError("Failed to fetch project groups")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchProjectGroups()
  }, [])

  const pendingGroups = projectGroups.filter(
    (g) => g.Status === "pending"
  )

  /* =======================
     UPDATE STATUS (PUT)
     (USES YOUR API)
  ======================= */
  const updateStatus = async (
    id: number,
    status: "approved" | "rejected"
  ) => {
    try {
      const res = await fetch(`/api/project-groups/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })

      if (!res.ok) throw new Error()

      setProjectGroups((prev) =>
        prev.map((g) =>
          g.ProjectGroupID === id ? { ...g, status } : g
        )
      )

      toast.success(`Project ${status}`)
    } catch {
      toast.error("Failed to update project")
    }
  }

  /* =======================
     LOADING / ERROR
  ======================= */
  if (loading) {
    return (
      <div className="p-10 text-center text-muted-foreground">
        Loading project approvals...
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-10 text-center text-destructive">
        {error}
      </div>
    )
  }

  /* =======================
     UI
  ======================= */
  return (
    <div className="min-h-screen">
      <Header
        title="Pending Approvals"
        description="Review and approve project proposals"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 space-y-6"
      >
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            icon={<Clock className="h-6 w-6 text-warning" />}
            value={pendingGroups.length}
            label="Pending"
          />
          <StatCard
            icon={<CheckCircle className="h-6 w-6 text-success" />}
            value={projectGroups.filter((g) => g.Status === "approved").length}
            label="Approved"
          />
          <StatCard
            icon={<XCircle className="h-6 w-6 text-destructive" />}
            value={projectGroups.filter((g) => g.Status === "rejected").length}
            label="Rejected"
          />
        </div>

        {/* Pending List */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>
              Pending Approvals ({pendingGroups.length})
            </CardTitle>
            <CardDescription>
              Projects waiting for approval
            </CardDescription>
          </CardHeader>

          <CardContent>
            {pendingGroups.length ? (
              <div className="space-y-4">
                {pendingGroups.map((group) => (
                  <div
                    key={group.ProjectGroupID}
                    className="p-6 rounded-xl border border-warning/30 bg-warning/5"
                  >
                    <div className="flex justify-between">
                      <div className="flex gap-4">
                        <div className="p-3 rounded-xl bg-warning/10">
                          <FolderKanban className="h-6 w-6 text-warning" />
                        </div>

                        <div>
                          <h3 className="font-semibold text-lg">
                            {group.ProjectTitle ?? "Untitled Project"}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {group.ProjectGroupName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {group.ProjectArea ?? "—"}
                          </p>
                        </div>
                      </div>

                      <Badge className="bg-warning/10 text-warning">
                        Pending
                      </Badge>
                    </div>

                    <p className="mt-4 text-sm text-muted-foreground">
                      {group.Description ?? "No description"}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">
                            {group.GuideStaffName
                              ?.split(" ")
                              .map((n) => n[1])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        Guide: {group.GuideStaffName}
                      </div>

                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        {group.MembersCount} members
                      </div>

                      <Badge variant="outline">
                        {group.ProjectTypeName}
                      </Badge>

                      <Badge variant="outline">
                        Avg CGPA: {group.AverageCPI}
                      </Badge>

                    </div>

                    <div className="mt-4 flex justify-end gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/dashboard/admin/approvals/${group.ProjectGroupID}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Link>
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive"
                        onClick={() =>
                          updateStatus(group.ProjectGroupID, "rejected")
                        }
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </Button>

                      <Button
                        size="sm"
                        className="bg-success"
                        onClick={() =>
                          updateStatus(group.ProjectGroupID, "approved")
                        }
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-12">
                No pending approvals 🎉
              </p>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

/* =======================
   Stat Card
======================= */
function StatCard({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode
  value: number
  label: string
}) {
  return (
    <Card>
      <CardContent className="p-6 flex items-center gap-4">
        {icon}
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  )
}
