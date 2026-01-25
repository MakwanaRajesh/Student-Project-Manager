// "use client"

// import { useParams, useRouter } from "next/navigation"
// import { motion } from "framer-motion"
// import { FolderKanban, ArrowLeft, CheckCircle, XCircle, Clock } from "lucide-react"
// import { Header } from "@/components/dashboard/header"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Avatar, AvatarFallback } from "@/components/ui/avatar"
// import { Separator } from "@/components/ui/separator"
// import { Textarea } from "@/components/ui/textarea"
// import { useAppStore } from "@/lib/store"
// import { toast } from "sonner"
// import { useState } from "react"

// export default function AdminApprovalDetailPage() {
//   const params = useParams()
//   const router = useRouter()
//   const { projectGroups, students, staff, projectTypes, approveProjectGroup, rejectProjectGroup } = useAppStore()
//   const [remarks, setRemarks] = useState("")

//   const project = projectGroups.find((p) => p.id === params.id)

//   if (!project) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <FolderKanban className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
//           <h2 className="text-xl font-semibold mb-2">Project Not Found</h2>
//           <p className="text-muted-foreground mb-4">The project you are looking for does not exist.</p>
//           <Button onClick={() => router.back()}>Go Back</Button>
//         </div>
//       </div>
//     )
//   }

//   const guide = staff.find((s) => s.id === project.guideStaffId)
//   const convener = staff.find((s) => s.id === project.convenerStaffId)
//   const expert = staff.find((s) => s.id === project.expertStaffId)
//   const projectType = projectTypes.find((t) => t.id === project.projectTypeId)

//   const handleApprove = () => {
//     approveProjectGroup(project.id)
//     toast.success("Project approved successfully!")
//     router.push("/dashboard/admin/approvals")
//   }

//   const handleReject = () => {
//     rejectProjectGroup(project.id)
//     toast.error("Project rejected")
//     router.push("/dashboard/admin/approvals")
//   }

//   return (
//     <div className="min-h-screen">
//       <Header title="Review Project" description="Admin review and approval" />

//       <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 space-y-6">
//         <Button variant="outline" onClick={() => router.back()}>
//           <ArrowLeft className="h-4 w-4 mr-2" />
//           Back to Approvals
//         </Button>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           <div className="lg:col-span-2 space-y-6">
//             <Card className="border-border/50">
//               <CardHeader>
//                 <div className="flex items-start justify-between">
//                   <div>
//                     <CardTitle className="text-2xl">{project.projectTitle}</CardTitle>
//                     <CardDescription className="mt-2">{project.name}</CardDescription>
//                   </div>
//                   <Badge
//                     className={
//                       project.status === "approved"
//                         ? "bg-success/10 text-success border-success/30"
//                         : project.status === "pending"
//                           ? "bg-warning/10 text-warning border-warning/30"
//                           : "bg-destructive/10 text-destructive border-destructive/30"
//                     }
//                   >
//                     {project.status === "approved" && <CheckCircle className="h-3 w-3 mr-1" />}
//                     {project.status === "pending" && <Clock className="h-3 w-3 mr-1" />}
//                     {project.status === "rejected" && <XCircle className="h-3 w-3 mr-1" />}
//                     {project.status}
//                   </Badge>
//                 </div>
//               </CardHeader>
//               <CardContent className="space-y-6">
//                 <div>
//                   <h4 className="font-medium mb-2">Project Description</h4>
//                   <p className="text-muted-foreground">{project.projectDescription}</p>
//                 </div>

//                 <Separator />

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <p className="text-sm text-muted-foreground">Project Type</p>
//                     <p className="font-medium">{projectType?.name}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-muted-foreground">Project Area</p>
//                     <p className="font-medium">{project.projectArea}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-muted-foreground">Average CGPA</p>
//                     <p className="font-medium">{project.averageCpi.toFixed(2)}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-muted-foreground">Team Size</p>
//                     <p className="font-medium">{project.members.length} members</p>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card className="border-border/50">
//               <CardHeader>
//                 <CardTitle>Team Members</CardTitle>
//                 <CardDescription>Students in this project group</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   {project.members.map((member) => {
//                     const student = students.find((s) => s.id === member.studentId)
//                     return (
//                       <div key={member.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
//                         <div className="flex items-center gap-4">
//                           <Avatar className="h-10 w-10">
//                             <AvatarFallback>{student?.name.charAt(0)}</AvatarFallback>
//                           </Avatar>
//                           <div>
//                             <div className="flex items-center gap-2">
//                               <p className="font-medium">{student?.name}</p>
//                               {member.isGroupLeader && (
//                                 <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
//                                   Leader
//                                 </Badge>
//                               )}
//                             </div>
//                             <p className="text-sm text-muted-foreground">{student?.email}</p>
//                           </div>
//                         </div>
//                         <div className="text-right">
//                           <p className="font-medium">{member.cgpa.toFixed(2)}</p>
//                           <p className="text-sm text-muted-foreground">CGPA</p>
//                         </div>
//                       </div>
//                     )
//                   })}
//                 </div>
//               </CardContent>
//             </Card>
//           </div>

//           <div className="space-y-6">
//             <Card className="border-border/50">
//               <CardHeader>
//                 <CardTitle>Faculty Assigned</CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 {guide && (
//                   <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
//                     <Avatar className="h-10 w-10">
//                       <AvatarFallback className="bg-primary text-primary-foreground">
//                         {guide.name.charAt(0)}
//                       </AvatarFallback>
//                     </Avatar>
//                     <div>
//                       <p className="font-medium text-sm">{guide.name}</p>
//                       <p className="text-xs text-muted-foreground">Project Guide</p>
//                     </div>
//                   </div>
//                 )}
//                 {convener && (
//                   <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
//                     <Avatar className="h-10 w-10">
//                       <AvatarFallback>{convener.name.charAt(0)}</AvatarFallback>
//                     </Avatar>
//                     <div>
//                       <p className="font-medium text-sm">{convener.name}</p>
//                       <p className="text-xs text-muted-foreground">Convener</p>
//                     </div>
//                   </div>
//                 )}
//                 {expert && (
//                   <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
//                     <Avatar className="h-10 w-10">
//                       <AvatarFallback>{expert.name.charAt(0)}</AvatarFallback>
//                     </Avatar>
//                     <div>
//                       <p className="font-medium text-sm">{expert.name}</p>
//                       <p className="text-xs text-muted-foreground">Expert</p>
//                     </div>
//                   </div>
//                 )}
//               </CardContent>
//             </Card>

//             {project.status === "pending" && (
//               <Card className="border-border/50">
//                 <CardHeader>
//                   <CardTitle>Admin Decision</CardTitle>
//                   <CardDescription>Approve or reject this project</CardDescription>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <div>
//                     <label className="text-sm font-medium mb-2 block">Remarks</label>
//                     <Textarea
//                       placeholder="Add comments..."
//                       value={remarks}
//                       onChange={(e) => setRemarks(e.target.value)}
//                       rows={3}
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Button onClick={handleApprove} className="w-full bg-success hover:bg-success/90">
//                       <CheckCircle className="h-4 w-4 mr-2" />
//                       Approve
//                     </Button>
//                     <Button onClick={handleReject} variant="destructive" className="w-full">
//                       <XCircle className="h-4 w-4 mr-2" />
//                       Reject
//                     </Button>
//                   </div>
//                 </CardContent>
//               </Card>
//             )}
//           </div>
//         </div>
//       </motion.div>
//     </div>
//   )
// }

"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  FolderKanban,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
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
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

/* ===================== TYPES ===================== */

interface Member {
  id: number
  studentName: string
  email: string
  cgpa: number
  isGroupLeader: boolean
}

interface Faculty {
  role: "Guide" | "Convener" | "Expert"
  name: string
}

interface ProjectDetail {
  id: number
  name: string
  projectTitle: string
  projectDescription: string
  projectArea: string
  projectTypeName: string
  averageCpi: number
  members: Member[]
  faculty: Faculty[]
  status: "pending" | "approved" | "rejected"
}

/* ===================== PAGE ===================== */

export default function AdminApprovalDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  const [project, setProject] = useState<ProjectDetail | null>(null)
  const [remarks, setRemarks] = useState("")
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState("")

  /* ===================== FETCH PROJECT ===================== */

  useEffect(() => {
    async function fetchProject() {
      try {
        const res = await fetch(`/api/project-groups/${id}`)

        if (res.status === 404) {
          setProject(null)
          return
        }

        if (!res.ok) {
          throw new Error("Failed to load project")
        }

        const data = await res.json()
        setProject(data)
      } catch (err) {
        setError("Unable to load project details")
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
  }, [id])

  /* ===================== ACTION HANDLERS ===================== */

  const updateStatus = async (status: "approved" | "rejected") => {
    if (!project) return

    if (status === "rejected" && remarks.trim().length < 5) {
      toast.error("Remarks are required for rejection")
      return
    }

    setActionLoading(true)

    try {
      const res = await fetch(`/api/project-groups/${id}/pending`, {
        method: "POST", // POST used instead of PATCH (your setup issue)
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, remarks }),
      })

      if (!res.ok) throw new Error()

      toast.success(`Project ${status}`)
      router.push("/dashboard/admin/approvals")
    } catch {
      toast.error("Action failed, please try again")
    } finally {
      setActionLoading(false)
    }
  }

  /* ===================== STATES ===================== */

  if (loading) {
    return <div className="p-6">Loading project...</div>
  }

  if (error) {
    return <div className="p-6 text-destructive">{error}</div>
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FolderKanban className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
          <h2 className="text-xl font-semibold mb-2">Project Not Found</h2>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    )
  }

  /* ===================== UI ===================== */

  return (
    <div className="min-h-screen">
      <Header title="Review Project" description="Admin review and approval" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 space-y-6"
      >
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between">
                  <div>
                    <CardTitle>{project.projectTitle}</CardTitle>
                    <CardDescription>{project.name}</CardDescription>
                  </div>
                  <Badge
                    className={
                      project.status === "approved"
                        ? "bg-success/10 text-success"
                        : project.status === "pending"
                        ? "bg-warning/10 text-warning"
                        : "bg-destructive/10 text-destructive"
                    }
                  >
                    {project.status === "approved" && <CheckCircle className="h-3 w-3 mr-1" />}
                    {project.status === "pending" && <Clock className="h-3 w-3 mr-1" />}
                    {project.status === "rejected" && <XCircle className="h-3 w-3 mr-1" />}
                    {project.status}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{project.projectDescription}</p>

                <Separator />

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Project Type</p>
                    <p className="font-medium">{project.projectTypeName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Project Area</p>
                    <p className="font-medium">{project.projectArea}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Average CGPA</p>
                    <p className="font-medium">{project.averageCpi.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Team Size</p>
                    <p className="font-medium">{project.members.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Team Members</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {project.members.map((m) => (
                  <div key={m.id} className="flex justify-between p-3 rounded bg-muted/30">
                    <div>
                      <p className="font-medium">{m.studentName}</p>
                      <p className="text-xs text-muted-foreground">{m.email}</p>
                    </div>
                    <div className="text-right">
                      <p>{m.cgpa.toFixed(2)}</p>
                      {m.isGroupLeader && <Badge variant="outline">Leader</Badge>}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* RIGHT */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Faculty Assigned</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {project.faculty.map((f, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 bg-muted/30 rounded">
                    <Avatar>
                      <AvatarFallback>{f.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{f.name}</p>
                      <p className="text-xs text-muted-foreground">{f.role}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {project.status === "pending" && (
              <Card>
                <CardHeader>
                  <CardTitle>Admin Decision</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="Remarks (required for rejection)"
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                  />
                  <Button
                    disabled={actionLoading}
                    onClick={() => updateStatus("approved")}
                    className="w-full bg-success"
                  >
                    Approve
                  </Button>
                  <Button
                    disabled={actionLoading}
                    onClick={() => updateStatus("rejected")}
                    variant="destructive"
                    className="w-full"
                  >
                    Reject
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
