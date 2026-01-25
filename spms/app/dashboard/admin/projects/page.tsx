"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import {
  FolderKanban,
  Users,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
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
import { DataTable, SortableHeader } from "@/components/shared/data-table"

import type { ColumnDef } from "@tanstack/react-table"

/* ===================== TYPES ===================== */

export interface ProjectGroup {
  id: number
  name: string
  projectTitle: string
  projectArea: string
  projectTypeId: number
  projectTypeName: string
  guideStaffName: string
  averageCpi: number
  membersCount: number
  status: "approved" | "pending" | "rejected"
}

/* ===================== PAGE ===================== */

export default function AdminProjectsPage() {
  const [projectGroups, setProjectGroups] = useState<ProjectGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  /* ===================== FETCH DATA ===================== */

  useEffect(() => {
    async function fetchProjectGroups() {
      try {
        const res = await fetch("/api/project-groups")

        if (!res.ok) {
          throw new Error("Failed to fetch project groups")
        }

        const data: ProjectGroup[] = await res.json()
        setProjectGroups(data)
      } catch (err) {
        setError("Something went wrong while loading project groups")
      } finally {
        setLoading(false)
      }
    }

    fetchProjectGroups()
  }, [])

  /* ===================== TABLE COLUMNS ===================== */

  const columns: ColumnDef<ProjectGroup>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <SortableHeader column={column}>Group</SortableHeader>
      ),
      cell: ({ row }) => {
        const group = row.original
        return (
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Users className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="font-medium">{group.name}</p>
              <p className="text-xs text-muted-foreground">
                {group.membersCount} members
              </p>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "projectTitle",
      header: "Project",
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.original.projectTitle}</p>
          <p className="text-xs text-muted-foreground">
            {row.original.projectArea}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "projectTypeName",
      header: "Type",
      cell: ({ row }) => (
        <Badge variant="outline">{row.original.projectTypeName}</Badge>
      ),
    },
    {
      accessorKey: "guideStaffName",
      header: "Guide",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarFallback className="text-xs">
              {row.original.guideStaffName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm">{row.original.guideStaffName}</span>
        </div>
      ),
    },
    {
      accessorKey: "averageCpi",
      header: ({ column }) => (
        <SortableHeader column={column}>Avg CPI</SortableHeader>
      ),
      cell: ({ row }) => (
        <span className="font-mono">
          {Number(row.original.averageCpi).toFixed(2)}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status

        return (
          <Badge
            className={
              status === "approved"
                ? "bg-success/10 text-success border-success/30"
                : status === "pending"
                  ? "bg-warning/10 text-warning border-warning/30"
                  : "bg-destructive/10 text-destructive border-destructive/30"
            }
          >
            {status === "approved" && (
              <CheckCircle className="h-3 w-3 mr-1" />
            )}
            {status === "pending" && (
              <Clock className="h-3 w-3 mr-1" />
            )}
            {status === "rejected" && (
              <XCircle className="h-3 w-3 mr-1" />
            )}
            {status}
          </Badge>
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/dashboard/admin/projects/${row.original.id}`}>
            <Eye className="h-4 w-4" />
          </Link>
        </Button>
      ),
    },
  ]

  /* ===================== STATS ===================== */

  const stats = {
    total: projectGroups.length,
    approved: projectGroups.filter((g) => g.status === "approved").length,
    pending: projectGroups.filter((g) => g.status === "pending").length,
    rejected: projectGroups.filter((g) => g.status === "rejected").length,
  }

  /* ===================== STATES ===================== */

  if (loading) {
    return <div className="p-6">Loading project groups...</div>
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>
  }

  /* ===================== UI ===================== */

  return (
    <div className="min-h-screen">
      <Header
        title="All Projects"
        description="Manage all project groups in the system"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 space-y-6"
      >
        {/* ===================== STATS ===================== */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard
            icon={<FolderKanban className="h-6 w-6 text-primary" />}
            label="Total Projects"
            value={stats.total}
          />
          <StatCard
            icon={<CheckCircle className="h-6 w-6 text-success" />}
            label="Approved"
            value={stats.approved}
          />
          <StatCard
            icon={<Clock className="h-6 w-6 text-warning" />}
            label="Pending"
            value={stats.pending}
          />
          <StatCard
            icon={<XCircle className="h-6 w-6 text-destructive" />}
            label="Rejected"
            value={stats.rejected}
          />
        </div>

        {/* ===================== TABLE ===================== */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>All Project Groups</CardTitle>
            <CardDescription>
              Complete list of all project groups
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={columns}
              data={projectGroups}
              searchKey="name"
              searchPlaceholder="Search projects..."
            />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

/* ===================== SMALL STAT CARD ===================== */

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: number
}) {
  return (
    <Card className="border-border/50">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-muted">{icon}</div>
          <div>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-sm text-muted-foreground">{label}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
