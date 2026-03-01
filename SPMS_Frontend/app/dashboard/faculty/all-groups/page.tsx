"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { FolderKanban, Users, Search, Eye, CheckCircle, Clock, XCircle } from "lucide-react"
import { Header } from "@/components/dashboard/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAppStore } from "@/lib/store"

export default function FacultyAllGroupsPage() {
  const { projectGroups, students, staff, projectTypes } = useAppStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filteredGroups = projectGroups.filter((group) => {
    const matchesSearch =
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.projectTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.projectArea.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || group.status === statusFilter
    return matchesSearch && matchesStatus
  })

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
      <Header title="All Project Groups" description="Browse all project groups in the system" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 space-y-6">
        {/* Filters */}
        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, title, or area..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <FolderKanban className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{projectGroups.length}</p>
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
                  <p className="text-2xl font-bold">{projectGroups.filter((g) => g.status === "approved").length}</p>
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
                  <p className="text-2xl font-bold">{projectGroups.filter((g) => g.status === "pending").length}</p>
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
                  <p className="text-2xl font-bold">{projectGroups.filter((g) => g.status === "rejected").length}</p>
                  <p className="text-sm text-muted-foreground">Rejected</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Groups List */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Project Groups ({filteredGroups.length})</CardTitle>
            <CardDescription>All registered project groups</CardDescription>
          </CardHeader>
          <CardContent>
            {filteredGroups.length > 0 ? (
              <div className="space-y-4">
                {filteredGroups.map((group) => {
                  const guide = staff.find((s) => s.id === group.guideStaffId)
                  const projectType = projectTypes.find((t) => t.id === group.projectTypeId)

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
                            <p className="text-sm text-muted-foreground mt-1">{group.name}</p>
                            <p className="text-sm text-muted-foreground">{group.projectArea}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(group.status)}
                          <Badge
                            className={
                              group.status === "approved"
                                ? "bg-success/10 text-success border-success/30"
                                : group.status === "pending"
                                  ? "bg-warning/10 text-warning border-warning/30"
                                  : "bg-destructive/10 text-destructive border-destructive/30"
                            }
                          >
                            {group.status}
                          </Badge>
                        </div>
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

                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex -space-x-2">
                          {group.members.slice(0, 4).map((member) => {
                            const student = students.find((s) => s.id === member.studentId)
                            return (
                              <Avatar key={member.id} className="h-8 w-8 border-2 border-background">
                                <AvatarFallback className="text-xs">{student?.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                            )
                          })}
                          {group.members.length > 4 && (
                            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs border-2 border-background">
                              +{group.members.length - 4}
                            </div>
                          )}
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/dashboard/groups/${group.id}`}>
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
                <h3 className="text-lg font-semibold mb-2">No Groups Found</h3>
                <p className="text-muted-foreground">No project groups match your search criteria.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
