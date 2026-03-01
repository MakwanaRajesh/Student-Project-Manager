"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Calendar, Clock, MapPin, FileText } from "lucide-react"
import { Header } from "@/components/dashboard/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAppStore } from "@/lib/store"
import { toast } from "sonner"

export default function FacultyScheduleMeetingPage() {
  const router = useRouter()
  const { user, projectGroups, staff, addMeeting } = useAppStore()
  const currentFaculty = staff.find((s) => s.email === user?.email) || staff[0]
  const myGroups = projectGroups.filter((g) => g.guideStaffId === currentFaculty?.id)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({ groupId: "", purpose: "", location: "", date: "", time: "", notes: "" })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.groupId || !formData.purpose || !formData.date || !formData.time) { toast.error("Please fill all required fields"); return }
    setIsLoading(true)
    try {
      const dateTime = new Date(`${formData.date}T${formData.time}`).toISOString()
      await addMeeting({
        projectGroupID: parseInt(formData.groupId),
        guideStaffID: parseInt(currentFaculty?.id || "0"),
        meetingDateTime: dateTime,
        meetingPurpose: formData.purpose,
        meetingLocation: formData.location,
        meetingNotes: formData.notes,
      })
      toast.success("Meeting scheduled successfully!")
      router.push("/dashboard/faculty/my-meetings")
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to schedule meeting")
    } finally { setIsLoading(false) }
  }

  return (
    <div className="min-h-screen">
      <Header title="Schedule Meeting" description="Schedule a new meeting with your project group" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6">
        <div className="max-w-2xl mx-auto">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Calendar className="h-5 w-5" />Meeting Details</CardTitle>
              <CardDescription>Fill in the details to schedule a meeting</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label>Select Group *</Label>
                  <Select value={formData.groupId} onValueChange={(v) => setFormData({ ...formData, groupId: v })}>
                    <SelectTrigger><SelectValue placeholder="Select a project group" /></SelectTrigger>
                    <SelectContent>{myGroups.map(g => <SelectItem key={g.id} value={g.id}>{g.name} - {g.projectTitle}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Meeting Purpose *</Label>
                  <div className="relative"><FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input placeholder="e.g., Progress Review" value={formData.purpose} onChange={e => setFormData({ ...formData, purpose: e.target.value })} className="pl-10" /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Date *</Label><div className="relative"><Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} className="pl-10" /></div></div>
                  <div className="space-y-2"><Label>Time *</Label><div className="relative"><Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input type="time" value={formData.time} onChange={e => setFormData({ ...formData, time: e.target.value })} className="pl-10" /></div></div>
                </div>
                <div className="space-y-2">
                  <Label>Location</Label>
                  <div className="relative"><MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input placeholder="Room 301, CS Building" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} className="pl-10" /></div>
                </div>
                <div className="space-y-2"><Label>Additional Notes</Label><Textarea placeholder="Any additional notes..." rows={4} value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} /></div>
                <div className="flex justify-end gap-4">
                  <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                  <Button type="submit" disabled={isLoading}>{isLoading ? "Scheduling..." : "Schedule Meeting"}</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  )
}
