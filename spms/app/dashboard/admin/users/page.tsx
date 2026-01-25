"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Users, GraduationCap, UserCog, Search } from "lucide-react"
import { Header } from "@/components/dashboard/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Link from "next/link"
import { toast } from "sonner"

type Student = {
  id: string
  name: string
  email: string
  phone: string
  description: string
  cgpa: number
}

type Staff = {
  id: string
  name: string
  email: string
  phone: string
  description: string
}

export default function AdminUsersPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [staff, setStaff] = useState<Staff[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  /* ================= FETCH ================= */

  const fetchStudents = async () => {
    const res = await fetch("/api/students")
    if (!res.ok) {
      toast.error("Failed to load students")
      return
    }

    const data = await res.json()
    setStudents(
      data.map((s: any) => ({
        id: String(s.StudentID),
        name: s.StudentName,
        email: s.Email,
        phone: s.Phone ?? "",
        description: s.Description ?? "",
        cgpa: Number(s.CGPA ?? 0),
      }))
    )
  }

  const fetchStaff = async () => {
    const res = await fetch("/api/staff")
    if (!res.ok) {
      toast.error("Failed to load staff")
      return
    }

    const data = await res.json()
    setStaff(
      data.map((s: any) => ({
        id: String(s.StaffID),
        name: s.StaffName,
        email: s.Email,
        phone: s.Phone ?? "",
        description: s.Description ?? "",
      }))
    )
  }

  useEffect(() => {
    fetchStudents()
    fetchStaff()
  }, [])

  /* ================= SEARCH ================= */

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredStaff = staff.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen">
      <Header title="User Management" description="Manage all users in the system" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 space-y-6"
      >
        {/* ================= STATS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <Users className="h-6 w-6 text-primary" />
              <div>
                <p className="text-2xl font-bold">{students.length + staff.length}</p>
                <p className="text-sm text-muted-foreground">Total Users</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <GraduationCap className="h-6 w-6 text-success" />
              <div>
                <p className="text-2xl font-bold">{students.length}</p>
                <p className="text-sm text-muted-foreground">Students</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <UserCog className="h-6 w-6 text-warning" />
              <div>
                <p className="text-2xl font-bold">{staff.length}</p>
                <p className="text-sm text-muted-foreground">Staff</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ================= SEARCH ================= */}
        <Card>
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* ================= TABS ================= */}
        <Tabs defaultValue="students">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="students">
              Students ({filteredStudents.length})
            </TabsTrigger>
            <TabsTrigger value="staff">
              Staff ({filteredStaff.length})
            </TabsTrigger>
          </TabsList>

          {/* ================= STUDENTS ================= */}
          <TabsContent value="students" className="mt-6">
            <Card>
              <CardHeader className="flex flex-row justify-between items-center">
                <div>
                  <CardTitle>Students</CardTitle>
                  <CardDescription>All registered students</CardDescription>
                </div>
                <Button asChild>
                  <Link href="/dashboard/admin/students">Manage Students</Link>
                </Button>
              </CardHeader>

              <CardContent className="space-y-4">
                {filteredStudents.map((student) => (
                  <div
                    key={student.id}
                    className="flex justify-between items-center p-4 border rounded-xl"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarFallback>
                          {student.name
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{student.name}</p>
                        <p className="text-sm text-muted-foreground">{student.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge variant="outline">CGPA: {student.cgpa.toFixed(2)}</Badge>
                      <Badge className="bg-success/10 text-success">
                        <GraduationCap className="h-3 w-3 mr-1" />
                        Student
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ================= STAFF ================= */}
          <TabsContent value="staff" className="mt-6">
            <Card>
              <CardHeader className="flex flex-row justify-between items-center">
                <div>
                  <CardTitle>Staff</CardTitle>
                  <CardDescription>All registered staff members</CardDescription>
                </div>
                <Button asChild>
                  <Link href="/dashboard/admin/staff">Manage Staff</Link>
                </Button>
              </CardHeader>

              <CardContent className="space-y-4">
                {filteredStaff.map((member) => (
                  <div
                    key={member.id}
                    className="flex justify-between items-center p-4 border rounded-xl"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarFallback>
                          {member.name
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-muted-foreground">{member.email}</p>
                        <p className="text-xs text-muted-foreground">{member.description}</p>
                      </div>
                    </div>

                    <Badge className="bg-warning/10 text-warning">
                      <UserCog className="h-3 w-3 mr-1" />
                      Faculty
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}
