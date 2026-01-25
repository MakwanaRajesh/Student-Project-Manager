"use client"

import { motion } from "framer-motion"
import { GraduationCap, Mail, Phone, Award, Users } from "lucide-react"
import { Header } from "@/components/dashboard/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DataTable, SortableHeader } from "@/components/shared/data-table"
import { useAppStore, type Student } from "@/lib/store"
import type { ColumnDef } from "@tanstack/react-table"

export default function FacultyStudentsPage() {
  const { user, projectGroups, students, staff } = useAppStore()

  const currentFaculty = staff.find((s) => s.email === user?.email) || staff[0]
  const myGroups = projectGroups.filter((g) => g.guideStaffId === currentFaculty?.id)

  // Get unique students under guidance
  const studentIds = [...new Set(myGroups.flatMap((g) => g.members.map((m) => m.studentId)))]
  const myStudents = students.filter((s) => studentIds.includes(s.id))

  const columns: ColumnDef<Student>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => <SortableHeader column={column}>Name</SortableHeader>,
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs">
              {row.original.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{row.original.name}</p>
            <p className="text-xs text-muted-foreground">{row.original.description}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{row.original.email}</span>
        </div>
      ),
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{row.original.phone}</span>
        </div>
      ),
    },
    {
      accessorKey: "cgpa",
      header: ({ column }) => <SortableHeader column={column}>CGPA</SortableHeader>,
      cell: ({ row }) => (
        <Badge variant="outline" className="font-mono">
          {row.original.cgpa.toFixed(2)}
        </Badge>
      ),
    },
    {
      id: "projects",
      header: "Projects",
      cell: ({ row }) => {
        const studentGroups = myGroups.filter((g) => g.members.some((m) => m.studentId === row.original.id))
        return <span className="text-sm">{studentGroups.length} project(s)</span>
      },
    },
  ]

  return (
    <div className="min-h-screen">
      <Header title="My Students" description="Students under your guidance" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <GraduationCap className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{myStudents.length}</p>
                  <p className="text-sm text-muted-foreground">Total Students</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-success/10">
                  <Award className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {myStudents.length > 0
                      ? (myStudents.reduce((acc, s) => acc + s.cgpa, 0) / myStudents.length).toFixed(2)
                      : "N/A"}
                  </p>
                  <p className="text-sm text-muted-foreground">Average CGPA</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-accent/10">
                  <Users className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{myGroups.length}</p>
                  <p className="text-sm text-muted-foreground">Project Groups</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Students Table */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Students Under Guidance</CardTitle>
            <CardDescription>All students in your project groups</CardDescription>
          </CardHeader>
          <CardContent>
            {myStudents.length > 0 ? (
              <DataTable columns={columns} data={myStudents} searchKey="name" searchPlaceholder="Search students..." />
            ) : (
              <div className="text-center py-12">
                <GraduationCap className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-lg font-semibold mb-2">No Students Yet</h3>
                <p className="text-muted-foreground">You don&apos;t have any students under your guidance yet.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
