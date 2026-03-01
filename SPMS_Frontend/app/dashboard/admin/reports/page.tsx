"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { BarChart3, FolderKanban, Users, FileText } from "lucide-react"
import { Header } from "@/components/dashboard/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function AdminReportsPage() {
  const reportTypes = [
    {
      title: "Project Reports",
      description: "Comprehensive analysis of all projects in the system",
      icon: FolderKanban,
      href: "/dashboard/admin/reports/projects",
      color: "bg-primary/10 text-primary",
    },
    {
      title: "Attendance Reports",
      description: "System-wide attendance statistics and analysis",
      icon: Users,
      href: "/dashboard/admin/reports/attendance",
      color: "bg-success/10 text-success",
    },
    {
      title: "Analytics Dashboard",
      description: "Visual analytics and performance metrics",
      icon: BarChart3,
      href: "/dashboard/admin/reports/analytics",
      color: "bg-warning/10 text-warning",
    },
  ]

  return (
    <div className="min-h-screen">
      <Header title="Reports & Analytics" description="Generate comprehensive reports and analytics" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
