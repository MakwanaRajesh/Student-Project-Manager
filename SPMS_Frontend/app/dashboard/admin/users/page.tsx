"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Users, GraduationCap, UserCog, Search } from "lucide-react"
import { Header } from "@/components/dashboard/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAppStore } from "@/lib/store"
import Link from "next/link"

export default function AdminUsersPage() {
  const { students, staff } = useAppStore()
  const [searchTerm, setSearchTerm] = useState("")

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredStaff = staff.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="min-h-screen">
      <Header title="User Management" description="Manage all users in the system" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{students.length + staff.length}</p>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-success/10">
                  <GraduationCap className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{students.length}</p>
                  <p className="text-sm text-muted-foreground">Students</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-warning/10">
                  <UserCog className="h-6 w-6 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{staff.length}</p>
                  <p className="text-sm text-muted-foreground">Staff</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="border-border/50">
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

        {/* Users Tabs */}
        <Tabs defaultValue="students">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="students">Students ({filteredStudents.length})</TabsTrigger>
            <TabsTrigger value="staff">Staff ({filteredStaff.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="students" className="mt-6">
            <Card className="border-border/50">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Students</CardTitle>
                  <CardDescription>All registered students</CardDescription>
                </div>
                <Button asChild>
                  <Link href="/dashboard/admin/students">Manage Students</Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredStudents.map((student) => (
                    <div
                      key={student.id}
                      className="flex items-center justify-between p-4 rounded-xl border border-border/50"
                    >
                      <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <p className="text-sm text-muted-foreground">{student.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant="outline">CGPA: {student.cgpa.toFixed(2)}</Badge>
                        <Badge className="bg-success/10 text-success border-success/30">
                          <GraduationCap className="h-3 w-3 mr-1" />
                          Student
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="staff" className="mt-6">
            <Card className="border-border/50">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Staff</CardTitle>
                  <CardDescription>All registered staff members</CardDescription>
                </div>
                <Button asChild>
                  <Link href="/dashboard/admin/staff">Manage Staff</Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredStaff.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-4 rounded-xl border border-border/50"
                    >
                      <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-muted-foreground">{member.email}</p>
                          <p className="text-xs text-muted-foreground">{member.description}</p>
                        </div>
                      </div>
                      <Badge className="bg-warning/10 text-warning border-warning/30">
                        <UserCog className="h-3 w-3 mr-1" />
                        Faculty
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}
