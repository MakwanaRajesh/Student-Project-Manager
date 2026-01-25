"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  LayoutDashboard,
  Settings,
  GraduationCap,
  FolderKanban,
  Calendar,
  ChevronDown,
  LogOut,
  BarChart3,
  Menu,
  X,
  UserCog,
  Users,
  ClipboardCheck,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAppStore, type UserRole } from "@/lib/store"
import { toast } from "sonner"

interface NavItem {
  title: string
  href?: string
  icon: React.ElementType
  items?: { title: string; href: string }[]
}

const studentNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard/student",
    icon: LayoutDashboard,
  },
  {
    title: "My Projects",
    icon: FolderKanban,
    items: [
      { title: "View Projects", href: "/dashboard/student/my-projects" },
      { title: "Submit Proposal", href: "/dashboard/student/submit-proposal" },
    ],
  },
  {
    title: "Meetings",
    icon: Calendar,
    items: [
      { title: "My Meetings", href: "/dashboard/student/my-meetings" },
      { title: "Meeting History", href: "/dashboard/student/meeting-history" },
    ],
  },
  {
    title: "My Profile",
    href: "/dashboard/student/profile",
    icon: Users,
  },
]

const facultyNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard/faculty",
    icon: LayoutDashboard,
  },
  {
    title: "My Groups",
    icon: FolderKanban,
    items: [
      { title: "Guided Groups", href: "/dashboard/faculty/my-groups" },
      { title: "All Groups", href: "/dashboard/faculty/all-groups" },
    ],
  },
  {
    title: "Approvals",
    href: "/dashboard/faculty/approvals",
    icon: ClipboardCheck,
  },
  {
    title: "Meetings",
    icon: Calendar,
    items: [
      { title: "My Meetings", href: "/dashboard/faculty/my-meetings" },
      { title: "Schedule Meeting", href: "/dashboard/faculty/schedule-meeting" },
      { title: "Attendance", href: "/dashboard/faculty/attendance" },
    ],
  },
  {
    title: "Students",
    href: "/dashboard/faculty/students",
    icon: GraduationCap,
  },
  {
    title: "Reports",
    icon: BarChart3,
    items: [
      { title: "Project Reports", href: "/dashboard/faculty/reports/projects" },
      { title: "Attendance Reports", href: "/dashboard/faculty/reports/attendance" },
    ],
  },
]

const adminNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Master Config",
    icon: Settings,
    items: [
      { title: "Project Types", href: "/dashboard/admin/project-types" },
      { title: "System Settings", href: "/dashboard/admin/settings" },
    ],
  },
  {
    title: "User Management",
    icon: UserCog,
    items: [
      { title: "All Users", href: "/dashboard/admin/users" },
      { title: "Staff Management", href: "/dashboard/admin/staff" },
      { title: "Student Management", href: "/dashboard/admin/students" },
    ],
  },
  {
    title: "Projects",
    icon: FolderKanban,
    items: [
      { title: "All Projects", href: "/dashboard/admin/projects" },
      { title: "Pending Approvals", href: "/dashboard/admin/approvals" },
    ],
  },
  {
    title: "Meetings",
    icon: Calendar,
    items: [
      { title: "All Meetings", href: "/dashboard/admin/meetings" },
      { title: "Attendance Overview", href: "/dashboard/admin/attendance" },
    ],
  },
  {
    title: "Reports & Analytics",
    icon: BarChart3,
    items: [
      { title: "Project Reports", href: "/dashboard/admin/reports/projects" },
      { title: "Attendance Reports", href: "/dashboard/admin/reports/attendance" },
      { title: "Analytics", href: "/dashboard/admin/reports/analytics" },
    ],
  },
]

function getNavItemsForRole(role: UserRole | undefined): NavItem[] {
  switch (role) {
    case "student":
      return studentNavItems
    case "faculty":
      return facultyNavItems
    case "admin":
      return adminNavItems
    default:
      return []
  }
}

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAppStore()
  const [openItems, setOpenItems] = useState<string[]>(["Dashboard"])
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const toggleItem = (title: string) => {
    setOpenItems((prev) => (prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]))
  }

  const handleLogout = () => {
    logout()
    toast.success("Logged out successfully")
    router.push("/login")
  }

  const navItems = getNavItemsForRole(user?.role)

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-sidebar">
      {/* Logo */}
      <div className="flex items-center gap-3 p-6 border-b border-sidebar-border">
        <div className="p-2 bg-sidebar-primary rounded-lg">
          <GraduationCap className="h-6 w-6 text-sidebar-primary-foreground" />
        </div>
        <div>
          <span className="text-xl font-bold text-sidebar-foreground">SPMS</span>
          <p className="text-xs text-sidebar-foreground/60 capitalize">{user?.role} Portal</p>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-4 py-4">
        <nav className="space-y-1">
          {navItems.map((item) => (
            <div key={item.title}>
              {item.href ? (
                <Link
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                    pathname === item.href
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.title}
                </Link>
              ) : (
                <>
                  <button
                    onClick={() => toggleItem(item.title)}
                    className={cn(
                      "flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                      "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="h-5 w-5" />
                      {item.title}
                    </div>
                    <ChevronDown
                      className={cn("h-4 w-4 transition-transform", openItems.includes(item.title) && "rotate-180")}
                    />
                  </button>
                  <AnimatePresence>
                    {openItems.includes(item.title) && item.items && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="ml-4 mt-1 space-y-1 border-l border-sidebar-border pl-4">
                          {item.items.map((subItem) => (
                            <Link
                              key={subItem.href}
                              href={subItem.href}
                              onClick={() => setIsMobileOpen(false)}
                              className={cn(
                                "flex items-center px-3 py-2 rounded-lg text-sm transition-all",
                                pathname === subItem.href
                                  ? "bg-sidebar-accent text-sidebar-primary font-medium"
                                  : "text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                              )}
                            >
                              {subItem.title}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}
            </div>
          ))}
        </nav>
      </ScrollArea>

      {/* User Profile */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-sidebar-accent/50">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground">
              {user?.name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">{user?.name || "User"}</p>
            <p className="text-xs text-sidebar-foreground/60 capitalize">{user?.role || "Guest"}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-0 left-0 h-full w-[280px] z-50 lg:hidden"
          >
            <SidebarContent />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-[280px] h-screen sticky top-0">
        <SidebarContent />
      </div>
    </>
  )
}
