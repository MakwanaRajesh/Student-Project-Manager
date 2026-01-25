"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { FileText, Users, Search, Plus, X } from "lucide-react"
import { Header } from "@/components/dashboard/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useAppStore } from "@/lib/store"
import { toast } from "sonner"

export default function StudentSubmitProposalPage() {
  const router = useRouter()
  const { user, students, staff, projectTypes, addProjectGroup } = useAppStore()

  const currentStudent = students.find((s) => s.email === user?.email) || students[0]

  const [formData, setFormData] = useState({
    groupName: "",
    projectTitle: "",
    projectArea: "",
    projectDescription: "",
    projectTypeId: "",
    guideStaffId: "",
  })

  const [selectedMembers, setSelectedMembers] = useState<string[]>([currentStudent?.id || ""])
  const [memberSearch, setMemberSearch] = useState("")

  const availableStudents = students.filter(
    (s) => !selectedMembers.includes(s.id) && s.name.toLowerCase().includes(memberSearch.toLowerCase()),
  )

  const handleAddMember = (studentId: string) => {
    if (selectedMembers.length < 4) {
      setSelectedMembers([...selectedMembers, studentId])
      setMemberSearch("")
    } else {
      toast.error("Maximum 4 members allowed per group")
    }
  }

  const handleRemoveMember = (studentId: string) => {
    if (studentId === currentStudent?.id) {
      toast.error("You cannot remove yourself from the group")
      return
    }
    setSelectedMembers(selectedMembers.filter((id) => id !== studentId))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.groupName || !formData.projectTitle || !formData.projectTypeId || !formData.guideStaffId) {
      toast.error("Please fill all required fields")
      return
    }

    const guide = staff.find((s) => s.id === formData.guideStaffId)
    const members = selectedMembers.map((studentId, index) => {
      const student = students.find((s) => s.id === studentId)
      return {
        id: `member-${Date.now()}-${index}`,
        groupId: "",
        studentId,
        isGroupLeader: studentId === currentStudent?.id,
        cgpa: student?.cgpa || 0,
        description: "",
      }
    })

    const averageCpi = members.reduce((acc, m) => acc + m.cgpa, 0) / members.length

    addProjectGroup({
      name: formData.groupName,
      projectTypeId: formData.projectTypeId,
      guideStaffId: formData.guideStaffId,
      guideStaffName: guide?.name || "",
      projectTitle: formData.projectTitle,
      projectArea: formData.projectArea,
      projectDescription: formData.projectDescription,
      averageCpi,
      status: "pending",
      description: "",
      members,
    })

    toast.success("Project proposal submitted successfully!")
    router.push("/dashboard/student/my-projects")
  }

  return (
    <div className="min-h-screen">
      <Header title="Submit Proposal" description="Create a new project group and submit your proposal" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Project Details
                  </CardTitle>
                  <CardDescription>Enter the details of your project proposal</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="groupName">Group Name *</Label>
                      <Input
                        id="groupName"
                        placeholder="Enter group name"
                        value={formData.groupName}
                        onChange={(e) => setFormData({ ...formData, groupName: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="projectType">Project Type *</Label>
                      <Select
                        value={formData.projectTypeId}
                        onValueChange={(v) => setFormData({ ...formData, projectTypeId: v })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {projectTypes.map((type) => (
                            <SelectItem key={type.id} value={type.id}>
                              {type.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="projectTitle">Project Title *</Label>
                    <Input
                      id="projectTitle"
                      placeholder="Enter project title"
                      value={formData.projectTitle}
                      onChange={(e) => setFormData({ ...formData, projectTitle: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="projectArea">Project Area</Label>
                    <Input
                      id="projectArea"
                      placeholder="e.g., Artificial Intelligence, Web Development"
                      value={formData.projectArea}
                      onChange={(e) => setFormData({ ...formData, projectArea: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="projectDescription">Project Description</Label>
                    <Textarea
                      id="projectDescription"
                      placeholder="Describe your project..."
                      rows={4}
                      value={formData.projectDescription}
                      onChange={(e) => setFormData({ ...formData, projectDescription: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="guide">Project Guide *</Label>
                    <Select
                      value={formData.guideStaffId}
                      onValueChange={(v) => setFormData({ ...formData, guideStaffId: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select guide" />
                      </SelectTrigger>
                      <SelectContent>
                        {staff.map((s) => (
                          <SelectItem key={s.id} value={s.id}>
                            {s.name} - {s.description}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  Cancel
                </Button>
                <Button type="submit">Submit Proposal</Button>
              </div>
            </div>

            {/* Team Members */}
            <div className="space-y-6">
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Team Members
                  </CardTitle>
                  <CardDescription>Add members to your project group (max 4)</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Selected Members */}
                  <div className="space-y-2">
                    {selectedMembers.map((memberId) => {
                      const student = students.find((s) => s.id === memberId)
                      const isLeader = memberId === currentStudent?.id
                      return (
                        <div key={memberId} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="text-xs">
                                {student?.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">{student?.name}</p>
                              <p className="text-xs text-muted-foreground">CGPA: {student?.cgpa}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {isLeader && (
                              <Badge variant="outline" className="text-xs">
                                Leader
                              </Badge>
                            )}
                            {!isLeader && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => handleRemoveMember(memberId)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Add Member */}
                  {selectedMembers.length < 4 && (
                    <div className="space-y-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search students..."
                          value={memberSearch}
                          onChange={(e) => setMemberSearch(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      {memberSearch && availableStudents.length > 0 && (
                        <div className="max-h-40 overflow-y-auto space-y-1 border rounded-lg p-2">
                          {availableStudents.slice(0, 5).map((student) => (
                            <button
                              key={student.id}
                              type="button"
                              onClick={() => handleAddMember(student.id)}
                              className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors text-left"
                            >
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="text-xs">
                                  {student.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-medium">{student.name}</p>
                                <p className="text-xs text-muted-foreground">CGPA: {student.cgpa}</p>
                              </div>
                              <Plus className="h-4 w-4 ml-auto text-muted-foreground" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <p className="text-xs text-muted-foreground">{selectedMembers.length}/4 members selected</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
