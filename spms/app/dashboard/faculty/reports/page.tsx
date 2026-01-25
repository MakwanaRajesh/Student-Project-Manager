"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { FolderKanban, Users, FileText } from "lucide-react"
import { Header } from "@/components/dashboard/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function FacultyReportsPage() {
  const reportTypes = [
    {
      title: "Project Reports",
      description: "View progress and status of all projects under your guidance",
      icon: FolderKanban,
      href: "/dashboard/faculty/reports/projects",
      color: "bg-primary/10 text-primary",
    },
    {
      title: "Attendance Reports",
      description: "Student attendance records across all meetings",
      icon: Users,
      href: "/dashboard/faculty/reports/attendance",
      color: "bg-success/10 text-success",
    },
  ]

  return (
    <div className="min-h-screen">
      <Header title="Reports" description="Generate and view various reports" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reportTypes.map((report) => (
            <Card key={report.title} className="border-border/50 hover:border-primary/30 transition-colors">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${report.color}`}>
                    <report.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle>{report.title}</CardTitle>
                    <CardDescription className="mt-2">{report.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href={report.href}>
                    <FileText className="h-4 w-4 mr-2" />
                    View Report
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
