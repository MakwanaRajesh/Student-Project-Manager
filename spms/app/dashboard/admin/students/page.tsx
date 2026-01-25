"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { GraduationCap, Mail, Phone, Plus, Edit2, Trash2, Award } from "lucide-react"
import { Header } from "@/components/dashboard/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { DataTable, SortableHeader } from "@/components/shared/data-table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import type { ColumnDef } from "@tanstack/react-table"

export type Student = {
  id: string
  name: string
  email: string
  phone: string
  description: string
  cgpa: number
}

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    description: "",
    cgpa: 0,
  })

  /* ================= FETCH ================= */
  const fetchStudents = async () => {
    const res = await fetch("/api/students")
    if (!res.ok) {
      toast.error("Failed to fetch students")
      return
    }

    const data = await res.json()
    setStudents(
      data.map((s: any) => ({
        id: String(s.StudentID),
        name: s.StudentName,
        email: s.Email,
        phone: s.Phone ?? "",
        description: s.Description ?? "",
        cgpa: Number(s.CGPA ?? 0),
      }))
    )
  }

  useEffect(() => {
    fetchStudents()
  }, [])

  /* ================= ADD ================= */
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.email) {
      toast.error("Name and Email required")
      return
    }

    const res = await fetch("/api/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        StudentName: formData.name,
        Phone: formData.phone,
        Email: formData.email,
        Password: "123456",
        Description: formData.description,
        CGPA: formData.cgpa,
      }),
    })

    if (!res.ok) {
      toast.error("Failed to add student")
      return
    }

    toast.success("Student added")
    setIsAddOpen(false)
    setFormData({ name: "", email: "", phone: "", description: "", cgpa: 0 })
    fetchStudents()
  }

  /* ================= UPDATE ================= */
  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingStudent) return

    const res = await fetch(`/api/students/${editingStudent.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        StudentID: editingStudent.id,
        StudentName: formData.name,
        Phone: formData.phone,
        Email: formData.email,
        Description: formData.description,
        CGPA: formData.cgpa,
      }),
    })

    if (!res.ok) {
      toast.error("Failed to update student")
      return
    }

    toast.success("Student updated")
    setEditingStudent(null)
    setFormData({ name: "", email: "", phone: "", description: "", cgpa: 0 })
    fetchStudents()
  }

  /* ================= DELETE ================= */
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this student?")) return

    const res = await fetch(`/api/students/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ StudentID: id }),
    })

    if (!res.ok) {
      toast.error("Failed to delete student")
      return
    }

    toast.success("Student deleted")
    fetchStudents()
  }

  const openEdit = (student: Student) => {
    setEditingStudent(student)
    setFormData(student)
  }

  /* ================= TABLE ================= */
  const columns: ColumnDef<Student>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => <SortableHeader column={column}>Name</SortableHeader>,
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs bg-accent/10">
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
    {
      accessorKey: "cgpa",
      header: ({ column }) => <SortableHeader column={column}>CGPA</SortableHeader>,
      cell: ({ row }) => (
        <Badge variant="outline" className="font-mono">
          {row.original.cgpa.toFixed(2)}
        </Badge>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button size="icon" variant="ghost" onClick={() => openEdit(row.original)}>
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" className="text-destructive"
            onClick={() => handleDelete(row.original.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  const StudentForm = ({ onSubmit }: { onSubmit: (e: React.FormEvent) => void }) => (
    <form onSubmit={onSubmit} className="space-y-4">
      <Label>Name</Label>
      <Input required value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })} />

      <Label>Email</Label>
      <Input required type="email" value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })} />

      <Label>Phone</Label>
      <Input value={formData.phone}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />

      <Label>CGPA</Label>
      <Input type="number" min="0" max="10" step="0.01"
        value={formData.cgpa}
        onChange={(e) => setFormData({ ...formData, cgpa: Number(e.target.value) })} />

      <Label>Description</Label>
      <Input value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })} />

      <Button type="submit">Save</Button>
    </form>
  )

  const avgCgpa =
    students.length > 0
      ? students.reduce((a, b) => a + b.cgpa, 0) / students.length
      : 0

  return (
    <div className="min-h-screen">
      <Header title="Student Management" description="Manage all students" />

      <motion.div className="p-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-6 flex items-center gap-2">
              <GraduationCap /> {students.length} Students
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-center gap-2">
              <Award /> Avg CGPA: {avgCgpa.toFixed(2)}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex justify-between flex-row">
            <CardTitle>Students</CardTitle>
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger asChild>
                <Button><Plus className="mr-1" /> Add Student</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Student</DialogTitle>
                  <DialogDescription>Enter student details</DialogDescription>
                </DialogHeader>
                <StudentForm onSubmit={handleAdd} />
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <DataTable columns={columns} data={students} />
          </CardContent>
        </Card>

        {/* EDIT DIALOG */}
        <Dialog
          open={!!editingStudent}
          onOpenChange={(open) => {
            if (!open) {
              setEditingStudent(null)
              setFormData({ name: "", email: "", phone: "", description: "", cgpa: 0 })
            }
          }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Student</DialogTitle>
              <DialogDescription>Update student details</DialogDescription>
            </DialogHeader>
            <StudentForm onSubmit={handleEdit} />
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  )
}
