"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { FolderKanban, Users, Eye, CheckCircle, Clock, XCircle } from "lucide-react"
import { Header } from "@/components/dashboard/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DataTable, SortableHeader } from "@/components/shared/data-table"
import { useAppStore, type ProjectGroup } from "@/lib/store"
import type { ColumnDef } from "@tanstack/react-table"

export default function AdminProjectsPage() {
  const { projectGroups, students, staff, projectTypes } = useAppStore()

  const columns: ColumnDef<ProjectGroup>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => <SortableHeader column={column}>Group</SortableHeader>,
      cell: ({ row }) => {
        const group = row.original
        return (
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Users className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="font-medium">{group.name}</p>
              <p className="text-xs text-muted-foreground">{group.members.length} members</p>
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
          <p className="text-xs text-muted-foreground">{row.original.projectArea}</p>
        </div>
      ),
    },
    {
      accessorKey: "projectTypeId",
      header: "Type",
      cell: ({ row }) => {
        const type = projectTypes.find((t) => t.id === row.original.projectTypeId)
        return <Badge variant="outline">{type?.name || "Unknown"}</Badge>
      },
    },
    {
      accessorKey: "guideStaffName",
      header: "Guide",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarFallback className="text-xs">
              {row.original.guideStaffName
                ?.split(" ")
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
      header: ({ column }) => <SortableHeader column={column}>Avg CPI</SortableHeader>,
      cell: ({ row }) => <span className="font-mono">{row.original.averageCpi.toFixed(2)}</span>,
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
            {status === "approved" && <CheckCircle className="h-3 w-3 mr-1" />}
            {status === "pending" && <Clock className="h-3 w-3 mr-1" />}
            {status === "rejected" && <XCircle className="h-3 w-3 mr-1" />}
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

  const stats = {
    total: projectGroups.length,
    approved: projectGroups.filter((g) => g.status === "approved").length,
    pending: projectGroups.filter((g) => g.status === "pending").length,
    rejected: projectGroups.filter((g) => g.status === "rejected").length,
  }

  return (
    <div className="min-h-screen">
      <Header title="All Projects" description="Manage all project groups in the system" />

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
          <Card className="border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-destructive/10">
                  <XCircle className="h-6 w-6 text-destructive" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.rejected}</p>
                  <p className="text-sm text-muted-foreground">Rejected</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Projects Table */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>All Project Groups</CardTitle>
            <CardDescription>Complete list of all project groups</CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable columns={columns} data={projectGroups} searchKey="name" searchPlaceholder="Search projects..." />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
