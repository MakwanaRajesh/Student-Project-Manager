"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Settings, Plus, Edit2, Trash2, FolderKanban } from "lucide-react"
import { Header } from "@/components/dashboard/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
// import { useAppStore, type ProjectType } from "@/lib/store"
import { toast } from "sonner"
import { Description } from "@radix-ui/react-toast"

type ProjectType = {
  id: string
  name: string
  description: string
}

export default function AdminProjectTypesPage() {

  const [projectTypes, setProjectTypes] = useState<ProjectType[]>([])
  const [projectGroups] = useState<any[]>([])

  // const { projectTypes, projectGroups, addProjectType, updateProjectType, deleteProjectType } = useAppStore()
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editingType, setEditingType] = useState<ProjectType | null>(null)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  })


  // const loadProjectTypes = async () => {
  //   try{
  //     const res = await fetch("/api/project-types")
  //     const data = await res.json()
  //     setProjectTypes(data)
  //   } catch {
  //     toast.error("Failed to load project types")
  //   }
  // }

  const loadProjectTypes = async () => {
    try {
      const res = await fetch("/api/project-types", {
        cache: "no-store",
      })

      if (!res.ok) throw new Error("Failed")

      const data = await res.json()
      setProjectTypes(data)
    } catch {
      toast.error("Failed to load project types")
    }
  }


  useEffect(() => {
    loadProjectTypes()
  }, [])


  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()


    if (!formData.name.trim()) {
      toast.error("Name is required")
      return
    }

    const res = await fetch("/api/project-types", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.name,
        description: formData.description,
      })

    })

    if (!res.ok) {
      const err = await res.json();
      toast.error(err.message || "Failed to add project type");
      return;
    }


    toast.success("Project type added successfully")
    setFormData({ name: "", description: "" })
    setIsAddOpen(false)
    loadProjectTypes()

    // addProjectType(formData)
    // toast.success("Project type added successfully!")
    // setFormData({ name: "", description: "" })
    // setIsAddOpen(false)
  }

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingType) return

    await fetch(`/api/project-types/${editingType.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    })

    toast.success("Project type updated successfully")
    setEditingType(null)
    setFormData({ name: "", description: "" })
    loadProjectTypes()


    // updateProjectType(editingType.id, formData)
    // toast.success("Project type updated successfully!")
    // setEditingType(null)
    // setFormData({ name: "", description: "" })
  }

  const handleDelete = async (id: string) => {
    await fetch(`/api/project-types/${id}`, { method: "DELETE" })
    toast.success("Project type deleted")
    loadProjectTypes()


    // const projectsUsingType = projectGroups.filter((g) => g.projectTypeId === id)
    // if (projectsUsingType.length > 0) {
    //   toast.error(`Cannot delete: ${projectsUsingType.length} projects using this type`)
    //   return
    // }
    // deleteProjectType(id)
    // toast.success("Project type deleted")
  }

  const openEdit = (type: ProjectType) => {
    setEditingType(type)
    setFormData({
      name: type.name,
      description: type.description,
    })
  }

  const TypeForm = ({ onSubmit, isEdit }: { onSubmit: (e: React.FormEvent) => void; isEdit?: boolean }) => (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name *</Label>
        <Input
          autoFocus
          id="name"
          placeholder="Enter project type name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Enter description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="submit">{isEdit ? "Update" : "Add"} Type</Button>
      </div>
    </form>
  )

  return (
    <div className="min-h-screen">
      <Header title="Project Types" description="Manage project type configurations" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-warning/10">
                  <Settings className="h-6 w-6 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{projectTypes.length}</p>
                  <p className="text-sm text-muted-foreground">Project Types</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Project Types */}
        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>All Project Types</CardTitle>
              <CardDescription>Configure project type categories</CardDescription>
            </div>
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Type
                </Button>
              </DialogTrigger>
              <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
                <DialogHeader>
                  <DialogTitle>Add Project Type</DialogTitle>
                  <DialogDescription>Create a new project type category</DialogDescription>
                </DialogHeader>
                <TypeForm onSubmit={handleAdd} />
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projectTypes.map((type) => {
                const projectsCount = projectGroups.filter((g) => g.projectTypeId === type.id).length
                return (
                  <div
                    key={type.id}
                    className="p-6 rounded-xl border border-border/50 hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="p-3 rounded-xl bg-primary/10">
                        <FolderKanban className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(type)}>
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDelete(type.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <h3 className="font-semibold mt-4">{type.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{type.description}</p>
                    <div className="mt-4 pt-4 border-t border-border/50">
                      <p className="text-sm text-muted-foreground">{projectsCount} projects using this type</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={!!editingType} onOpenChange={(open) => !open && setEditingType(null)}>
          <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
            <DialogHeader>
              <DialogTitle>Edit Project Type</DialogTitle>
              <DialogDescription>Update project type details</DialogDescription>
            </DialogHeader>
            <TypeForm onSubmit={handleEdit} isEdit />
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  )
}
