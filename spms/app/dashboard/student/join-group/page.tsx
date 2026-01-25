"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Users, FolderKanban, Search, UserPlus, CheckCircle } from "lucide-react"
import { Header } from "@/components/dashboard/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAppStore } from "@/lib/store"
import { toast } from "sonner"

export default function StudentJoinGroupPage() {
  const { user, projectGroups, students, staff, projectTypes, updateProjectGroup } = useAppStore()
  const [searchTerm, setSearchTerm] = useState("")

  const currentStudent = students.find((s) => s.email === user?.email) || students[0]

  // Get groups student is already a member of
  const myGroupIds = projectGroups
    .filter((group) => group.members.some((m) => m.studentId === currentStudent?.id))
    .map((g) => g.id)

  // Get groups available to join (not already a member and still pending/forming)
  const availableGroups = projectGroups.filter(
    (group) => !myGroupIds.includes(group.id) && group.status === "pending" && group.members.length < 4, // Max 4 members per group
  )

  const filteredGroups = availableGroups.filter(
    (group) =>
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.projectTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.projectArea.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleJoinRequest = (groupId: string) => {
    const group = projectGroups.find((g) => g.id === groupId)
    if (!group || !currentStudent) return

    // Add current student to the group
    const newMember = {
      id: Math.random().toString(36).substr(2, 9),
      groupId: groupId,
      studentId: currentStudent.id,
      isGroupLeader: false,
      cgpa: currentStudent.cgpa,
      description: "",
    }

    const updatedMembers = [...group.members, newMember]
    const newAverageCpi = updatedMembers.reduce((acc, m) => acc + m.cgpa, 0) / updatedMembers.length

    updateProjectGroup(groupId, {
      members: updatedMembers,
      averageCpi: newAverageCpi,
    })

    toast.success(`Successfully joined ${group.name}!`)
  }

  return (
    <div className="min-h-screen">
      <Header title="Join a Group" description="Browse and join available project groups" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 space-y-6">
        {/* Search */}
        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search groups by name, project title, or area..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <FolderKanban className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{availableGroups.length}</p>
                  <p className="text-sm text-muted-foreground">Available Groups</p>
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
                  <p className="text-2xl font-bold">{myGroupIds.length}</p>
                  <p className="text-sm text-muted-foreground">My Groups</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-warning/10">
                  <Users className="h-6 w-6 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{filteredGroups.length}</p>
                  <p className="text-sm text-muted-foreground">Search Results</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Available Groups */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Available Project Groups</CardTitle>
            <CardDescription>Groups looking for new members</CardDescription>
          </CardHeader>
          <CardContent>
            {filteredGroups.length > 0 ? (
              <div className="space-y-4">
                {filteredGroups.map((group) => {
                  const guide = staff.find((s) => s.id === group.guideStaffId)
                  const projectType = projectTypes.find((t) => t.id === group.projectTypeId)
                  const spotsLeft = 4 - group.members.length

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
                        <Badge className="bg-warning/10 text-warning border-warning/30">
                          {spotsLeft} spot{spotsLeft !== 1 ? "s" : ""} left
                        </Badge>
                      </div>

                      <p className="mt-4 text-sm text-muted-foreground">{group.projectDescription}</p>

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
                          {group.members.map((member) => {
                            const student = students.find((s) => s.id === member.studentId)
                            return (
                              <Avatar key={member.id} className="h-8 w-8 border-2 border-background">
                                <AvatarFallback className="text-xs">{student?.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                            )
                          })}
                        </div>
                        <Button onClick={() => handleJoinRequest(group.id)}>
                          <UserPlus className="h-4 w-4 mr-2" />
                          Join Group
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-lg font-semibold mb-2">No Groups Available</h3>
                <p className="text-muted-foreground">There are no groups looking for members right now.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
