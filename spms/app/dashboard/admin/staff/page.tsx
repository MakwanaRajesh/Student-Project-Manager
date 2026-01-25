"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { UserCog, Mail, Phone, Plus, Edit2, Trash2 } from "lucide-react"
import { Header } from "@/components/dashboard/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DataTable, SortableHeader } from "@/components/shared/data-table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useAppStore, type Staff } from "@/lib/store"
import { toast } from "sonner"
import type { ColumnDef } from "@tanstack/react-table"
// import { Description } from "@radix-ui/react-toast"

export default function AdminStaffPage() {
  // const { staff, projectGroups, addStaff, updateStaff, deleteStaff } = useAppStore()
  const [staff, setStaff] = useState<Staff[]>([])
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    description: "",
  })

  const fetchStaff = async () => {
    const res = await fetch("/api/staff")

    if (!res.ok) {
      const text = await res.text()
      console.log("API ERROR:", text)
      return
    }

    const data = await res.json()

    setStaff(
      data.map((s: any) => ({
        id: String(s.StaffID),
        name: s.StaffName,
        email: s.Email,
        phone: s.Phone ?? "",
        description: s.Description ?? ""
      }))
    )
  }

  useEffect(() => {
    fetchStaff()
  }, [])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email) {
      toast.error("Name and email are required")
      return
    }

    setLoading(true)

    const res = await fetch("/api/staff", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        StaffName: formData.name,
        Phone: formData.phone,
        Email: formData.email,
        Password: "123456",
        Description: formData.description,
      }),
    })

    setLoading(false)

    if (!res.ok) {
      toast.error("Failed to add staff")
      return
    }

    toast.success("Staff added")
    setIsAddOpen(false)
    setFormData({ name: "", email: "", phone: "", description: "" })
    fetchStaff()
  }


  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingStaff) return

    const res = await fetch(`/api/staff/${editingStaff.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        StaffID: editingStaff.id,
        StaffName: formData.name,
        Phone: formData.phone,
        Email: formData.email,
        Description: formData.description,
      }),
    })
    if (!res.ok) {
      toast.error("Failed to update staff")
      return
    }


    toast.success("Staff updated")
    setEditingStaff(null)
    fetchStaff()
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this staff member?")) return

    const res = await fetch(`/api/staff/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ StaffID: id }),
    })

    if (!res.ok) {
      toast.error("Failed to delete staff")
      return
    }

    toast.success("Staff deleted")
    fetchStaff()
  }



  const openEdit = (staffMember: Staff) => {
    setEditingStaff(staffMember)
    setFormData({
      name: staffMember.name,
      email: staffMember.email,
      phone: staffMember.phone,
      description: staffMember.description,
    })
  }

  const columns: ColumnDef<Staff>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => <SortableHeader column={column}>Name</SortableHeader>,
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs bg-primary/10">
              {row.original.name
                ?.split(" ")
                .filter(Boolean)
                .map((n) => n[0])
                .join("")
                .toUpperCase()}

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
    // {
    //   id: "groups",
    //   header: "Groups Guided",
    //   cell: ({ row }) => {
    //     const guidedGroups = projectGroups.filter((g) => g.guideStaffId === row.original.id)
    //     return <span className="text-sm">{guidedGroups.length}</span>
    //   },
    // },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => openEdit(row.original)}>
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive hover:text-destructive"
            onClick={() => handleDelete(row.original.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  const StaffForm = ({ onSubmit, isEdit }: { onSubmit: (e: React.FormEvent) => void; isEdit?: boolean }) => (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name </Label>
        <Input
          id="name"
          placeholder="Enter name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email </Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          placeholder="Enter phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          placeholder="e.g., Professor - Computer Science"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : isEdit ? "Update Staff" : "Add Staff"}
        </Button>

      </div>
    </form>
  )

  return (
    <div className="min-h-screen">
      <Header title="Staff Management" description="Manage faculty and staff members" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <UserCog className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{staff.length}</p>
                  <p className="text-sm text-muted-foreground">Total Staff</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Staff Table */}
        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>All Staff Members</CardTitle>
              <CardDescription>Manage faculty and staff</CardDescription>
            </div>
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Staff
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Staff Member</DialogTitle>
                  <DialogDescription>Fill in the details to add a new staff member</DialogDescription>
                </DialogHeader>
                <StaffForm onSubmit={handleAdd} />
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <DataTable columns={columns} data={staff} searchKey="name" searchPlaceholder="Search staff..." />
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog
          open={!!editingStaff}
          onOpenChange={(open) => {
            if (!open) {
              setEditingStaff(null)
              setFormData({ name: "", email: "", phone: "", description: "" })
            }
          }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Staff Member</DialogTitle>
              <DialogDescription>Update staff member details</DialogDescription>
            </DialogHeader>
            <StaffForm onSubmit={handleEdit} isEdit />
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  )
}
