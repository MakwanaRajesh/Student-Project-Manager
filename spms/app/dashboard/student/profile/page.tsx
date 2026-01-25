"use client"

import { motion } from "framer-motion"
import { Mail, Phone, GraduationCap, BookOpen, Award, Calendar } from "lucide-react"
import { Header } from "@/components/dashboard/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useAppStore } from "@/lib/store"

export default function StudentProfilePage() {
  const { user, students, projectGroups } = useAppStore()

  const currentStudent = students.find((s) => s.email === user?.email) || students[0]
  const myGroups = projectGroups.filter((group) => group.members.some((m) => m.studentId === currentStudent?.id))
  const leaderGroups = myGroups.filter((group) =>
    group.members.some((m) => m.studentId === currentStudent?.id && m.isGroupLeader),
  )

  return (
    <div className="min-h-screen">
      <Header title="My Profile" description="View your profile and academic information" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 space-y-6">
        {/* Profile Card */}
        <Card className="border-border/50">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-start gap-8">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="text-3xl bg-primary text-primary-foreground">
                  {currentStudent?.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold">{currentStudent?.name}</h2>
                  <Badge className="bg-primary/10 text-primary border-primary/30">Student</Badge>
                </div>
                <p className="text-muted-foreground">{currentStudent?.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-muted">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{currentStudent?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-muted">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{currentStudent?.phone}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Academic Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-success/10">
                  <Award className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{currentStudent?.cgpa.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">CGPA</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{myGroups.length}</p>
                  <p className="text-sm text-muted-foreground">Projects</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-warning/10">
                  <GraduationCap className="h-6 w-6 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{leaderGroups.length}</p>
                  <p className="text-sm text-muted-foreground">As Leader</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-accent/10">
                  <Calendar className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {currentStudent?.created
                      ? new Date(currentStudent.created).toLocaleDateString("en-US", { year: "numeric" })
                      : "2024"}
                  </p>
                  <p className="text-sm text-muted-foreground">Joined</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Projects */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>My Projects</CardTitle>
            <CardDescription>Projects you are part of</CardDescription>
          </CardHeader>
          <CardContent>
            {myGroups.length > 0 ? (
              <div className="space-y-3">
                {myGroups.map((group) => {
                  const isLeader = group.members.some((m) => m.studentId === currentStudent?.id && m.isGroupLeader)
                  return (
                    <div key={group.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <BookOpen className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{group.projectTitle}</p>
                          <p className="text-sm text-muted-foreground">{group.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {isLeader && (
                          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                            Leader
                          </Badge>
                        )}
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
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No projects yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
