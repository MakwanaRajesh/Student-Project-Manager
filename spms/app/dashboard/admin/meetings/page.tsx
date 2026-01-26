// "use client"

// import { useState } from "react"
// import { motion } from "framer-motion"
// import { Calendar, Users, Clock, CheckCircle, MapPin, Search } from "lucide-react"
// import { Header } from "@/components/dashboard/header"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Input } from "@/components/ui/input"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Avatar, AvatarFallback } from "@/components/ui/avatar"
// import { useAppStore } from "@/lib/store"

// export default function AdminMeetingsPage() {
//   const { meetings, projectGroups, staff } = useAppStore()
//   const [searchTerm, setSearchTerm] = useState("")
//   const [statusFilter, setStatusFilter] = useState<string>("all")

//   const filteredMeetings = meetings
//     .filter((m) => {
//       const group = projectGroups.find((g) => g.id === m.groupId)
//       const matchesSearch =
//         m.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         group?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         m.location.toLowerCase().includes(searchTerm.toLowerCase())
//       const matchesStatus = statusFilter === "all" || m.status === statusFilter
//       return matchesSearch && matchesStatus
//     })
//     .sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime())

//   const scheduledCount = meetings.filter((m) => m.status === "scheduled").length
//   const completedCount = meetings.filter((m) => m.status === "completed").length
//   const cancelledCount = meetings.filter((m) => m.status === "cancelled").length

//   return (
//     <div className="min-h-screen">
//       <Header title="All Meetings" description="View and manage all project meetings" />

//       <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 space-y-6">
//         {/* Stats */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//           <Card className="border-border/50">
//             <CardContent className="p-6">
//               <div className="flex items-center gap-4">
//                 <div className="p-3 rounded-xl bg-primary/10">
//                   <Calendar className="h-6 w-6 text-primary" />
//                 </div>
//                 <div>
//                   <p className="text-2xl font-bold">{meetings.length}</p>
//                   <p className="text-sm text-muted-foreground">Total Meetings</p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//           <Card className="border-border/50">
//             <CardContent className="p-6">
//               <div className="flex items-center gap-4">
//                 <div className="p-3 rounded-xl bg-warning/10">
//                   <Clock className="h-6 w-6 text-warning" />
//                 </div>
//                 <div>
//                   <p className="text-2xl font-bold">{scheduledCount}</p>
//                   <p className="text-sm text-muted-foreground">Scheduled</p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//           <Card className="border-border/50">
//             <CardContent className="p-6">
//               <div className="flex items-center gap-4">
//                 <div className="p-3 rounded-xl bg-success/10">
//                   <CheckCircle className="h-6 w-6 text-success" />
//                 </div>
//                 <div>
//                   <p className="text-2xl font-bold">{completedCount}</p>
//                   <p className="text-sm text-muted-foreground">Completed</p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//           <Card className="border-border/50">
//             <CardContent className="p-6">
//               <div className="flex items-center gap-4">
//                 <div className="p-3 rounded-xl bg-muted">
//                   <Calendar className="h-6 w-6 text-muted-foreground" />
//                 </div>
//                 <div>
//                   <p className="text-2xl font-bold">{cancelledCount}</p>
//                   <p className="text-sm text-muted-foreground">Cancelled</p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Filters */}
//         <Card className="border-border/50">
//           <CardContent className="p-6">
//             <div className="flex flex-col md:flex-row gap-4">
//               <div className="relative flex-1">
//                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                 <Input
//                   placeholder="Search by purpose, group, or location..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="pl-10"
//                 />
//               </div>
//               <Select value={statusFilter} onValueChange={setStatusFilter}>
//                 <SelectTrigger className="w-full md:w-48">
//                   <SelectValue placeholder="Filter by status" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="all">All Status</SelectItem>
//                   <SelectItem value="scheduled">Scheduled</SelectItem>
//                   <SelectItem value="completed">Completed</SelectItem>
//                   <SelectItem value="cancelled">Cancelled</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Meetings List */}
//         <Card className="border-border/50">
//           <CardHeader>
//             <CardTitle>Meetings ({filteredMeetings.length})</CardTitle>
//             <CardDescription>All project meetings in the system</CardDescription>
//           </CardHeader>
//           <CardContent>
//             {filteredMeetings.length > 0 ? (
//               <div className="space-y-4">
//                 {filteredMeetings.map((meeting) => {
//                   const group = projectGroups.find((g) => g.id === meeting.groupId)
//                   const guide = staff.find((s) => s.id === meeting.guideStaffId)

//                   return (
//                     <div
//                       key={meeting.id}
//                       className="p-4 rounded-xl border border-border/50 hover:border-primary/30 transition-colors"
//                     >
//                       <div className="flex items-start justify-between">
//                         <div className="flex items-start gap-4">
//                           <div
//                             className={`p-3 rounded-lg ${
//                               meeting.status === "completed"
//                                 ? "bg-success/10"
//                                 : meeting.status === "scheduled"
//                                   ? "bg-warning/10"
//                                   : "bg-muted"
//                             }`}
//                           >
//                             <Calendar
//                               className={`h-5 w-5 ${
//                                 meeting.status === "completed"
//                                   ? "text-success"
//                                   : meeting.status === "scheduled"
//                                     ? "text-warning"
//                                     : "text-muted-foreground"
//                               }`}
//                             />
//                           </div>
//                           <div>
//                             <h4 className="font-medium">{meeting.purpose}</h4>
//                             <p className="text-sm text-muted-foreground">
//                               {group?.name} - {group?.projectTitle}
//                             </p>
//                           </div>
//                         </div>
//                         <Badge
//                           className={
//                             meeting.status === "completed"
//                               ? "bg-success/10 text-success border-success/30"
//                               : meeting.status === "scheduled"
//                                 ? "bg-warning/10 text-warning border-warning/30"
//                                 : "bg-muted text-muted-foreground"
//                           }
//                         >
//                           {meeting.status}
//                         </Badge>
//                       </div>

//                       <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
//                         <div className="flex items-center gap-2">
//                           <Calendar className="h-4 w-4" />
//                           {new Date(meeting.dateTime).toLocaleDateString("en-US", {
//                             weekday: "short",
//                             month: "short",
//                             day: "numeric",
//                             hour: "2-digit",
//                             minute: "2-digit",
//                           })}
//                         </div>
//                         <div className="flex items-center gap-2">
//                           <MapPin className="h-4 w-4" />
//                           {meeting.location}
//                         </div>
//                         <div className="flex items-center gap-2">
//                           <Avatar className="h-5 w-5">
//                             <AvatarFallback className="text-xs">{guide?.name.charAt(0)}</AvatarFallback>
//                           </Avatar>
//                           {guide?.name}
//                         </div>
//                         {meeting.status === "completed" && (
//                           <div className="flex items-center gap-2">
//                             <Users className="h-4 w-4" />
//                             {meeting.attendance.filter((a) => a.isPresent).length}/{meeting.attendance.length} attended
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   )
//                 })}
//               </div>
//             ) : (
//               <div className="text-center py-12">
//                 <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
//                 <h3 className="text-lg font-semibold mb-2">No Meetings Found</h3>
//                 <p className="text-muted-foreground">No meetings match your search criteria.</p>
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       </motion.div>
//     </div>
//   )
// }

"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Calendar, Users, Clock, CheckCircle, MapPin, Search } from "lucide-react"
import { Header } from "@/components/dashboard/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAppStore } from "@/lib/store"

interface Meeting {
  id: string
  groupId: string
  guideStaffId: string
  GuideStaffName: string
  dateTime: string
  purpose: string
  ProjectGroupName: string
  ProjectTitle: string
  location: string
  status: "scheduled" | "completed" | "cancelled"
  attendance: { isPresent: boolean }[]
}


export default function AdminMeetingsPage() {
  // const { meetings, projectGroups, staff } = useAppStore()
  const { projectGroups, staff } = useAppStore()
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")


  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const res = await fetch("/api/project-meetings")
        const data = await res.json()

        const formatted = data.map((m: any) => ({
          id: m.ProjectMeetingID,
          groupId: m.ProjectGroupID,
          guideStaffId: m.GuideStaffID,
          GuideStaffName: m.GuideStaffName,
          ProjectGroupName: m.ProjectGroupName,
          ProjectTitle: m.ProjectTitle,
          dateTime: m.MeetingDateTime,
          purpose: m.MeetingPurpose,
          location: m.MeetingLocation,
          status: "scheduled", // default
          attendance: [],      // optional
        }))

        setMeetings(formatted)
      } catch (error) {
        console.error("Failed to load meetings", error)
      }
    }

    fetchMeetings()
  }, [])


  const filteredMeetings = meetings
    .filter((m) => {
      const group = projectGroups.find((g) => g.id === m.groupId)
      const matchesSearch =
        m.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.ProjectGroupName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.location.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "all" || m.status === statusFilter
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime())

  const scheduledCount = meetings.filter((m) => m.status === "scheduled").length
  const completedCount = meetings.filter((m) => m.status === "completed").length
  const cancelledCount = meetings.filter((m) => m.status === "cancelled").length

  return (
    <div className="min-h-screen">
      <Header title="All Meetings" description="View and manage all project meetings" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{meetings.length}</p>
                  <p className="text-sm text-muted-foreground">Total Meetings</p>
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
                  <p className="text-2xl font-bold">{scheduledCount}</p>
                  <p className="text-sm text-muted-foreground">Scheduled</p>
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
                  <p className="text-2xl font-bold">{completedCount}</p>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-muted">
                  <Calendar className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{cancelledCount}</p>
                  <p className="text-sm text-muted-foreground">Cancelled</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by purpose, group, or location..."
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
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Meetings List */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Meetings ({filteredMeetings.length})</CardTitle>
            <CardDescription>All project meetings in the system</CardDescription>
          </CardHeader>
          <CardContent>
            {filteredMeetings.length > 0 ? (
              <div className="space-y-4">
                {filteredMeetings.map((meeting) => {
                  const group = projectGroups.find((g) => g.id === meeting.groupId)
                  const guide = staff.find((s) => s.id === meeting.guideStaffId)

                  return (
                    <div
                      key={meeting.id}
                      className="p-4 rounded-xl border border-border/50 hover:border-primary/30 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div
                            className={`p-3 rounded-lg ${meeting.status === "completed"
                              ? "bg-success/10"
                              : meeting.status === "scheduled"
                                ? "bg-warning/10"
                                : "bg-muted"
                              }`}
                          >
                            <Calendar
                              className={`h-5 w-5 ${meeting.status === "completed"
                                ? "text-success"
                                : meeting.status === "scheduled"
                                  ? "text-warning"
                                  : "text-muted-foreground"
                                }`}
                            />
                          </div>
                          <div>
                            <h4 className="font-medium">{meeting.purpose}</h4>
                            <p className="text-sm text-muted-foreground">
                              {meeting.ProjectGroupName} - {meeting.ProjectTitle}
                            </p>
                          </div>
                        </div>
                        <Badge
                          className={
                            meeting.status === "completed"
                              ? "bg-success/10 text-success border-success/30"
                              : meeting.status === "scheduled"
                                ? "bg-warning/10 text-warning border-warning/30"
                                : "bg-muted text-muted-foreground"
                          }
                        >
                          {meeting.status}
                        </Badge>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {new Date(meeting.dateTime).toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {meeting.location}
                        </div>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-5 w-5">
                            <AvatarFallback className="text-xs">{meeting.GuideStaffName.charAt(4)}</AvatarFallback>
                          </Avatar>
                          {meeting.GuideStaffName}
                        </div>
                        {meeting.status === "completed" && (
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            {meeting.attendance.filter((a) => a.isPresent).length}/{meeting.attendance.length} attended
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-lg font-semibold mb-2">No Meetings Found</h3>
                <p className="text-muted-foreground">No meetings match your search criteria.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
