"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { GraduationCap, Mail, Phone, Plus, Edit2, Trash2 } from "lucide-react"
import { Header } from "@/components/dashboard/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { DataTable, SortableHeader } from "@/components/shared/data-table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useAppStore, type Student } from "@/lib/store"
import { toast } from "sonner"
import type { ColumnDef } from "@tanstack/react-table"
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog"
// import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Trash2Icon } from "lucide-react"



export default function AdminStudentsPage() {
  const { students, projectGroups, addStudent, updateStudent, deleteStudent } = useAppStore()
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({ studentName: "", email: "", phone: "", description: "", password: "", cgpa: "" })

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.studentName || !formData.email || !formData.password) { toast.error("Name, email and password are required"); return }
    setIsLoading(true)
    try {
      await addStudent({ ...formData, cgpa: parseFloat(formData.cgpa) || 0 })
      toast.success("Student added!")
      setFormData({ studentName: "", email: "", phone: "", description: "", password: "", cgpa: "" })
      setIsAddOpen(false)
    } catch (err: unknown) { toast.error(err instanceof Error ? err.message : "Failed") } finally { setIsLoading(false) }
  }

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingStudent) return
    setIsLoading(true)
    try {
      await updateStudent(editingStudent.id, { studentName: formData.studentName, email: formData.email, phone: formData.phone, description: formData.description, cgpa: parseFloat(formData.cgpa) || 0 })
      toast.success("Student updated!")
      setEditingStudent(null)
    } catch (err: unknown) { toast.error(err instanceof Error ? err.message : "Failed") } finally { setIsLoading(false) }
  }

  const handleDelete = async (id: string) => {
    try { await deleteStudent(id); toast.success("Student deleted") } catch (err: unknown) { toast.error(err instanceof Error ? err.message : "Failed") }
  }

  const openEdit = (s: Student) => { setEditingStudent(s); setFormData({ studentName: s.name, email: s.email, phone: s.phone, description: s.description, password: "", cgpa: s.cgpa.toString() }) }

  const columns: ColumnDef<Student>[] = [
    { accessorKey: "name", header: ({ column }) => <SortableHeader column={column}>Name</SortableHeader>, cell: ({ row }) => (<div className="flex items-center gap-3"><Avatar className="h-8 w-8"><AvatarFallback className="text-xs">{row.original.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()}</AvatarFallback></Avatar><div><p className="font-medium">{row.original.name}</p><p className="text-xs text-muted-foreground">{row.original.description}</p></div></div>) },
    { accessorKey: "email", header: "Email", cell: ({ row }) => (<div className="flex items-center gap-2"><Mail className="h-3 w-3 text-muted-foreground" /><span className="text-sm">{row.original.email}</span></div>) },
    { accessorKey: "phone", header: "Phone", cell: ({ row }) => (<div className="flex items-center gap-2"><Phone className="h-3 w-3 text-muted-foreground" /><span className="text-sm">{row.original.phone || "-"}</span></div>) },
    { accessorKey: "cgpa", header: ({ column }) => <SortableHeader column={column}>CGPA</SortableHeader>, cell: ({ row }) => { const cgpa = row.original.cgpa; return <Badge variant={cgpa >= 8.5 ? "default" : cgpa >= 7 ? "secondary" : "destructive"}>{cgpa.toFixed(2)}</Badge> } },
    { id: "groups", header: "Groups", cell: ({ row }) => { const count = projectGroups.filter(g => g.members.some(m => m.studentId === row.original.id)).length; return <span className="text-sm">{count}</span> } },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">

          {/* Edit Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => openEdit(row.original)}
            className="h-8 w-8 p-0"
          >
            <Edit2 className="h-4 w-4" />
          </Button>

          {/* Delete Confirmation Dialog */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Student?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the student.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleDelete(row.original.id)}
                  className="bg-destructive text-white hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

        </div>
      ),
    }
  ]

  const renderForm = (onSubmit: (e: React.FormEvent) => void, isEdit: boolean) => (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2"><Label>Full Name *</Label><Input value={formData.studentName} onChange={e => setFormData({ ...formData, studentName: e.target.value })} placeholder="John Smith" required /></div>
        <div className="space-y-2"><Label>Email *</Label><Input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="john@student.edu" required /></div>
        <div className="space-y-2"><Label>Phone</Label><Input value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="9123456780" /></div>
        <div className="space-y-2"><Label>CGPA</Label><Input type="number" step="0.01" min="0" max="10" value={formData.cgpa} onChange={e => setFormData({ ...formData, cgpa: e.target.value })} placeholder="8.5" /></div>
        {!isEdit && <div className="space-y-2 col-span-2"><Label>Password *</Label><Input type="password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} required /></div>}
        <div className="space-y-2 col-span-2"><Label>Description</Label><Input value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="CSE - 4th Year" /></div>
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? "Saving..." : isEdit ? "Update Student" : "Add Student"}</Button>
    </form>
  )

  return (
    <div className="min-h-screen">
      <Header title="Student Management" description="Manage all registered students" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card><CardContent className="p-6"><div className="flex items-center gap-4"><div className="p-3 rounded-xl bg-primary/10"><GraduationCap className="h-6 w-6 text-primary" /></div><div><p className="text-2xl font-bold">{students.length}</p><p className="text-sm text-muted-foreground">Total Students</p></div></div></CardContent></Card>
          <Card><CardContent className="p-6"><div className="flex items-center gap-4"><div className="p-3 rounded-xl bg-success/10"><GraduationCap className="h-6 w-6 text-success" /></div><div><p className="text-2xl font-bold">{students.filter(s => s.cgpa >= 8.5).length}</p><p className="text-sm text-muted-foreground">CGPA ≥ 8.5</p></div></div></CardContent></Card>
          <Card><CardContent className="p-6"><div className="flex items-center gap-4"><div className="p-3 rounded-xl bg-accent/10"><GraduationCap className="h-6 w-6 text-accent" /></div><div><p className="text-2xl font-bold">{students.length > 0 ? (students.reduce((a, s) => a + s.cgpa, 0) / students.length).toFixed(2) : "N/A"}</p><p className="text-sm text-muted-foreground">Avg CGPA</p></div></div></CardContent></Card>
        </div>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div><CardTitle>Students</CardTitle><CardDescription>{students.length} students registered</CardDescription></div>
              <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" />Add Student</Button></DialogTrigger>
                <DialogContent className="max-w-lg"><DialogHeader><DialogTitle>Add Student</DialogTitle><DialogDescription>Register a new student</DialogDescription></DialogHeader>{renderForm(handleAdd, false)}</DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent><DataTable columns={columns} data={students} searchKey="name" searchPlaceholder="Search students..." /></CardContent>
        </Card>
      </motion.div>
      <Dialog open={!!editingStudent} onOpenChange={open => { if (!open) setEditingStudent(null) }}>
        <DialogContent className="max-w-lg"><DialogHeader><DialogTitle>Edit Student</DialogTitle><DialogDescription>Update student information</DialogDescription></DialogHeader>{editingStudent && renderForm(handleEdit, true)}</DialogContent>
      </Dialog>
    </div>
  )
}
