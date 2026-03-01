"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { UserCog, Mail, Phone, Plus, Edit2, Trash2 } from "lucide-react"
import { Header } from "@/components/dashboard/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DataTable, SortableHeader } from "@/components/shared/data-table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAppStore, type Staff } from "@/lib/store"
import { toast } from "sonner"
import type { ColumnDef } from "@tanstack/react-table"

export default function AdminStaffPage() {
  const { staff, projectGroups, addStaff, updateStaff, deleteStaff } = useAppStore()
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({ staffName: "", email: "", phone: "", description: "", password: "", role: "Faculty" })

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.staffName || !formData.email || !formData.password) { toast.error("Name, email and password are required"); return }
    setIsLoading(true)
    try {
      await addStaff(formData)
      toast.success("Staff member added successfully!")
      setFormData({ staffName: "", email: "", phone: "", description: "", password: "", role: "Faculty" })
      setIsAddOpen(false)
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to add staff")
    } finally { setIsLoading(false) }
  }

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingStaff) return
    setIsLoading(true)
    try {
      await updateStaff(editingStaff.id, { staffName: formData.staffName, email: formData.email, phone: formData.phone, description: formData.description, role: formData.role })
      toast.success("Staff member updated successfully!")
      setEditingStaff(null)
      setFormData({ staffName: "", email: "", phone: "", description: "", password: "", role: "Faculty" })
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to update staff")
    } finally { setIsLoading(false) }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteStaff(id)
      toast.success("Staff member deleted")
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to delete staff")
    }
  }

  const openEdit = (s: Staff) => {
    setEditingStaff(s)
    setFormData({ staffName: s.name, email: s.email, phone: s.phone, description: s.description, password: "", role: s.role || "Faculty" })
  }

  const columns: ColumnDef<Staff>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => <SortableHeader column={column}>Name</SortableHeader>,
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary/10 text-primary text-xs">{row.original.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{row.original.name}</p>
            <p className="text-xs text-muted-foreground">{row.original.role}</p>
          </div>
        </div>
      ),
    },
    { accessorKey: "email", header: ({ column }) => <SortableHeader column={column}>Email</SortableHeader>, cell: ({ row }) => (<div className="flex items-center gap-2"><Mail className="h-3 w-3 text-muted-foreground" /><span className="text-sm">{row.original.email}</span></div>) },
    { accessorKey: "phone", header: "Phone", cell: ({ row }) => (<div className="flex items-center gap-2"><Phone className="h-3 w-3 text-muted-foreground" /><span className="text-sm">{row.original.phone || "-"}</span></div>) },
    { accessorKey: "description", header: "Department", cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.description || "-"}</span> },
    {
      id: "groups",
      header: "Groups",
      cell: ({ row }) => {
        const count = projectGroups.filter((g) => g.guideStaffId === row.original.id).length
        return <span className="text-sm font-medium">{count}</span>
      },
    },
    {
      id: "actions", header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => openEdit(row.original)} className="h-8 w-8 p-0"><Edit2 className="h-4 w-4" /></Button>
          <Button variant="ghost" size="sm" onClick={() => handleDelete(row.original.id)} className="h-8 w-8 p-0 text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
        </div>
      ),
    },
  ]

  const renderStaffForm = (onSubmit: (e: React.FormEvent) => void, isEdit: boolean) => (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2"><Label>Full Name *</Label><Input value={formData.staffName} onChange={(e) => setFormData({ ...formData, staffName: e.target.value })} placeholder="Dr. John Doe" required /></div>
        <div className="space-y-2"><Label>Email *</Label><Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="john@university.edu" required /></div>
        <div className="space-y-2"><Label>Phone</Label><Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="9876543210" /></div>
        <div className="space-y-2">
          <Label>Role</Label>
          <Select value={formData.role} onValueChange={(v) => setFormData({ ...formData, role: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="Admin">Admin</SelectItem><SelectItem value="Faculty">Faculty</SelectItem></SelectContent>
          </Select>
        </div>
        {!isEdit && <div className="space-y-2 col-span-2"><Label>Password *</Label><Input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} placeholder="Min 6 characters" required /></div>}
        <div className="space-y-2 col-span-2"><Label>Department / Description</Label><Input value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Professor - Computer Science" /></div>
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? (isEdit ? "Updating..." : "Adding...") : (isEdit ? "Update Staff" : "Add Staff")}</Button>
    </form>
  )

  return (
    <div className="min-h-screen">
      <Header title="Staff Management" description="Manage faculty and staff members" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-border/50"><CardContent className="p-6"><div className="flex items-center gap-4"><div className="p-3 rounded-xl bg-primary/10"><UserCog className="h-6 w-6 text-primary" /></div><div><p className="text-2xl font-bold">{staff.length}</p><p className="text-sm text-muted-foreground">Total Staff</p></div></div></CardContent></Card>
          <Card className="border-border/50"><CardContent className="p-6"><div className="flex items-center gap-4"><div className="p-3 rounded-xl bg-success/10"><UserCog className="h-6 w-6 text-success" /></div><div><p className="text-2xl font-bold">{staff.filter(s => s.role === "Admin" || s.role === "admin").length}</p><p className="text-sm text-muted-foreground">Admins</p></div></div></CardContent></Card>
          <Card className="border-border/50"><CardContent className="p-6"><div className="flex items-center gap-4"><div className="p-3 rounded-xl bg-accent/10"><UserCog className="h-6 w-6 text-accent" /></div><div><p className="text-2xl font-bold">{staff.filter(s => s.role === "Faculty" || s.role === "faculty").length}</p><p className="text-sm text-muted-foreground">Faculty</p></div></div></CardContent></Card>
        </div>
        <Card className="border-border/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div><CardTitle>Staff Members</CardTitle><CardDescription>{staff.length} staff members registered</CardDescription></div>
              <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" />Add Staff</Button></DialogTrigger>
                <DialogContent className="max-w-lg"><DialogHeader><DialogTitle>Add New Staff Member</DialogTitle><DialogDescription>Add a new faculty or admin member</DialogDescription></DialogHeader>{renderStaffForm(handleAdd, false)}</DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent><DataTable columns={columns} data={staff} searchKey="name" searchPlaceholder="Search staff..." /></CardContent>
        </Card>
      </motion.div>
      <Dialog open={!!editingStaff} onOpenChange={(open) => { if (!open) setEditingStaff(null) }}>
        <DialogContent className="max-w-lg"><DialogHeader><DialogTitle>Edit Staff Member</DialogTitle><DialogDescription>Update staff member information</DialogDescription></DialogHeader>{editingStaff && renderStaffForm(handleEdit, true)}</DialogContent>
      </Dialog>
    </div>
  )
}
