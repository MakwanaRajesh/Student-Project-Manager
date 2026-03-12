"use client"

import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import {
  authApi,
  staffApi,
  studentsApi,
  projectTypesApi,
  projectGroupsApi,
  meetingsApi,
  attendanceApi,
  reportsApi,
  setToken,
  removeToken,
  type ApiStaff,
  type ApiStudent,
  type ApiProjectType,
  type ApiProjectGroup,
  type ApiMeeting,
  type ApiDashboardStats,
} from "./api"

export type UserRole = "admin" | "faculty" | "student"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  phone?: string
  avatar?: string
}

export interface ProjectType {
  id: string
  name: string
  description: string
  created: Date
  modified: Date
}

export interface Staff {
  id: string
  name: string
  email: string
  phone: string
  description: string
  role: string
  created: Date
  modified: Date
}

export interface Student {
  id: string
  name: string
  email: string
  phone: string
  description: string
  cgpa: number
  created: Date
  modified: Date
}

export interface ProjectGroupMember {
  id: string
  groupId: string
  studentId: string
  isGroupLeader: boolean
  cgpa: number
  description: string
  student?: Student
}

export interface ProjectGroup {
  id: string
  name: string
  projectTypeId: string
  guideStaffId: string
  guideStaffName: string
  projectTitle: string
  projectArea: string
  projectDescription: string
  averageCpi: number
  convenerStaffId?: string
  expertStaffId?: string
  status: "pending" | "approved" | "rejected"
  statusDescription?: string
  description: string
  members: ProjectGroupMember[]
  created: Date
  modified: Date
}

export interface ProjectMeeting {
  id: string
  groupId: string
  groupName?: string
  guideStaffId: string
  dateTime: Date
  purpose: string
  location: string
  notes: string
  status: "scheduled" | "completed" | "cancelled"
  statusDescription: string
  attendance: MeetingAttendance[]
  created: Date
  modified: Date
}

export interface MeetingAttendance {
  id: string
  meetingId: string
  studentId: string
  studentName?: string
  isPresent: boolean
  remarks: string
}

function toStaff(s: ApiStaff): Staff {
  return { id: s.staffID.toString(), name: s.staffName, email: s.email, phone: s.phone || "", description: s.description || "", role: s.role, created: new Date(s.created), modified: new Date(s.modified) }
}

function toStudent(s: ApiStudent): Student {
  return { id: s.studentID.toString(), name: s.studentName, email: s.email, phone: s.phone || "", description: s.description || "", cgpa: s.cgpa, created: new Date(s.created), modified: new Date(s.modified) }
}

function toProjectType(pt: ApiProjectType): ProjectType {
  return { id: pt.projectTypeID.toString(), name: pt.projectTypeName, description: pt.description || "", created: new Date(pt.created), modified: new Date(pt.modified) }
}

function toProjectGroup(g: ApiProjectGroup): ProjectGroup {
  return {
    id: g.projectGroupID.toString(), name: g.projectGroupName, projectTypeId: g.projectTypeID.toString(),
    guideStaffId: g.guideStaffID.toString(), guideStaffName: g.guideStaffName || "",
    projectTitle: g.projectTitle || "", projectArea: g.projectArea || "", projectDescription: g.projectDescription || "",
    averageCpi: g.averageCPI, convenerStaffId: g.convenerStaffID?.toString(), expertStaffId: g.expertStaffID?.toString(),
    status: g.status as "pending" | "approved" | "rejected", statusDescription: g.statusDescription,
    description: g.description || "", created: new Date(g.created), modified: new Date(g.modified),
    members: (g.members || []).map((m) => ({
      id: m.projectGroupMemberID.toString(), groupId: m.projectGroupID.toString(), studentId: m.studentID.toString(),
      isGroupLeader: m.isGroupLeader, cgpa: m.studentCGPA, description: m.description || "",
      student: m.studentName ? { id: m.studentID.toString(), name: m.studentName, email: m.studentEmail || "", phone: m.studentPhone || "", description: "", cgpa: m.studentCGPA, created: new Date(m.created), modified: new Date(m.created) } : undefined
    }))
  }
}

function toMeeting(m: ApiMeeting): ProjectMeeting {
  return {
    id: m.projectMeetingID.toString(), groupId: m.projectGroupID.toString(), groupName: m.groupName,
    guideStaffId: m.guideStaffID.toString(), dateTime: new Date(m.meetingDateTime),
    purpose: m.meetingPurpose, location: m.meetingLocation || "", notes: m.meetingNotes || "",
    status: m.meetingStatus as "scheduled" | "completed" | "cancelled", statusDescription: m.statusDescription || "",
    created: new Date(m.created), modified: new Date(m.modified),
    attendance: (m.attendances || []).map((a) => ({ id: a.projectMeetingAttendanceID.toString(), meetingId: a.projectMeetingID.toString(), studentId: a.studentID.toString(), studentName: a.studentName, isPresent: a.isPresent, remarks: a.attendanceRemarks || "" }))
  }
}

interface AppState {
  user: User | null
  isAuthenticated: boolean
  token: string | null
  isLoading: boolean
  error: string | null
  dataLoaded: boolean
  projectTypes: ProjectType[]
  staff: Staff[]
  students: Student[]
  projectGroups: ProjectGroup[]
  meetings: ProjectMeeting[]
  dashboardStats: ApiDashboardStats | null

  login: (email: string, password: string, role: UserRole) => Promise<void>
  logout: () => void
  loadAllData: () => Promise<void>
  loadProjectTypes: () => Promise<void>
  loadStaff: () => Promise<void>
  loadStudents: () => Promise<void>
  loadProjectGroups: () => Promise<void>
  loadMeetings: () => Promise<void>
  loadDashboardStats: () => Promise<void>

  addProjectType: (data: { projectTypeName: string; description?: string }) => Promise<void>
  updateProjectType: (id: string, data: { projectTypeName: string; description?: string }) => Promise<void>
  deleteProjectType: (id: string) => Promise<void>

  addStaff: (data: { staffName: string; email: string; phone?: string; password: string; role: string; description?: string }) => Promise<void>
  updateStaff: (id: string, data: { staffName: string; email: string; phone?: string; description?: string; role: string }) => Promise<void>
  deleteStaff: (id: string) => Promise<void>

  addStudent: (data: { studentName: string; email: string; phone?: string; password: string; description?: string; cgpa: number }) => Promise<void>
  updateStudent: (id: string, data: { studentName: string; email: string; phone?: string; description?: string; cgpa: number }) => Promise<void>
  deleteStudent: (id: string) => Promise<void>

  addProjectGroup: (data: { projectGroupName: string; projectTypeID: number; guideStaffID: number; projectTitle?: string; projectArea?: string; projectDescription?: string; convenerStaffID?: number; expertStaffID?: number; description?: string; members: { studentID: number; isGroupLeader: boolean; studentCGPA: number }[] }) => Promise<void>
  updateProjectGroup: (id: string, data: unknown) => Promise<void>
  deleteProjectGroup: (id: string) => Promise<void>
  approveProjectGroup: (id: string, statusDescription?: string) => Promise<void>
  rejectProjectGroup: (id: string, statusDescription?: string) => Promise<void>

  addMeeting: (data: { projectGroupID: number; guideStaffID: number; meetingDateTime: string; meetingPurpose: string; meetingLocation?: string; meetingNotes?: string }) => Promise<void>
  updateMeeting: (id: string, data: { meetingDateTime?: string; meetingPurpose?: string; meetingLocation?: string; meetingNotes?: string; meetingStatus?: string; statusDescription?: string }) => Promise<void>
  deleteMeeting: (id: string) => Promise<void>
  updateAttendance: (meetingId: string, attendances: { studentID: number; isPresent: boolean; attendanceRemarks?: string }[]) => Promise<void>
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      token: null, user: null, isAuthenticated: false, isLoading: false, error: null, dataLoaded: false,
      projectTypes: [], staff: [], students: [], projectGroups: [], meetings: [], dashboardStats: null,

      login: async (email, password, role) => {
        set({ isLoading: true, error: null })
        try {
          const res = await authApi.login(email, password, role)
          setToken(res.token)
          set({ token: res.token, user: { id: res.userId.toString(), name: res.name, email: res.email, role: res.role as UserRole }, isAuthenticated: true, isLoading: false, dataLoaded: false })
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : "Login failed"
          set({ isLoading: false, error: message })
          throw err
        }
      },

      logout: () => {
        removeToken()
        set({ token: null, user: null, isAuthenticated: false, dataLoaded: false, projectTypes: [], staff: [], students: [], projectGroups: [], meetings: [], dashboardStats: null })
      },

      loadAllData: async () => {
        if (get().dataLoaded) return
        await Promise.allSettled([get().loadProjectTypes(), get().loadStaff(), get().loadStudents(), get().loadProjectGroups(), get().loadMeetings(), get().loadDashboardStats()])
        set({ dataLoaded: true })
      },

      loadProjectTypes: async () => { try { set({ projectTypes: (await projectTypesApi.getAll()).map(toProjectType) }) } catch { } },
      loadStaff: async () => { try { set({ staff: (await staffApi.getAll()).map(toStaff) }) } catch { } },
      loadStudents: async () => { try { set({ students: (await studentsApi.getAll()).map(toStudent) }) } catch { } },
      loadProjectGroups: async () => { try { set({ projectGroups: (await projectGroupsApi.getAll()).map(toProjectGroup) }) } catch { } },
      loadMeetings: async () => { try { set({ meetings: (await meetingsApi.getAll()).map(toMeeting) }) } catch { } },
      loadDashboardStats: async () => { try { set({ dashboardStats: await reportsApi.getDashboardStats() }) } catch { } },

      addProjectType: async (data) => { const r = await projectTypesApi.create(data); set(s => ({ projectTypes: [...s.projectTypes, toProjectType(r)] })) },
      updateProjectType: async (id, data) => { const r = await projectTypesApi.update(parseInt(id), data); set(s => ({ projectTypes: s.projectTypes.map(pt => pt.id === id ? toProjectType(r) : pt) })) },
      deleteProjectType: async (id) => { await projectTypesApi.delete(parseInt(id)); set(s => ({ projectTypes: s.projectTypes.filter(pt => pt.id !== id) })) },

      addStaff: async (data) => { const r = await staffApi.create(data); set(s => ({ staff: [...s.staff, toStaff(r)] })) },
      updateStaff: async (id, data) => { const r = await staffApi.update(parseInt(id), data); set(s => ({ staff: s.staff.map(st => st.id === id ? toStaff(r) : st) })) },
      deleteStaff: async (id) => { await staffApi.delete(parseInt(id)); set(s => ({ staff: s.staff.filter(st => st.id !== id) })) },

      addStudent: async (data) => { const r = await studentsApi.create(data); set(s => ({ students: [...s.students, toStudent(r)] })) },
      updateStudent: async (id, data) => { const r = await studentsApi.update(parseInt(id), data); set(s => ({ students: s.students.map(st => st.id === id ? toStudent(r) : st) })) },
      deleteStudent: async (id) => { await studentsApi.delete(parseInt(id)); set(s => ({ students: s.students.filter(st => st.id !== id) })) },

      addProjectGroup: async (data) => { await projectGroupsApi.create(data); const all = await projectGroupsApi.getAll(); set({ projectGroups: all.map(toProjectGroup) }) },
      updateProjectGroup: async (id, data) => { await projectGroupsApi.update(parseInt(id), data); const all = await projectGroupsApi.getAll(); set({ projectGroups: all.map(toProjectGroup) }) },
      deleteProjectGroup: async (id) => { await projectGroupsApi.delete(parseInt(id)); set(s => ({ projectGroups: s.projectGroups.filter(g => g.id !== id) })) },
      approveProjectGroup: async (id, desc) => { await projectGroupsApi.updateStatus(parseInt(id), "approved", desc); set(s => ({ projectGroups: s.projectGroups.map(g => g.id === id ? { ...g, status: "approved" as const, statusDescription: desc } : g) })) },
      rejectProjectGroup: async (id, desc) => { await projectGroupsApi.updateStatus(parseInt(id), "rejected", desc); set(s => ({ projectGroups: s.projectGroups.map(g => g.id === id ? { ...g, status: "rejected" as const, statusDescription: desc } : g) })) },

      addMeeting: async (data) => { await meetingsApi.create(data); const all = await meetingsApi.getAll(); set({ meetings: all.map(toMeeting) }) },
      updateMeeting: async (id, data) => { await meetingsApi.update(parseInt(id), data); set(s => ({ meetings: s.meetings.map(m => m.id === id ? { ...m, ...(data.meetingDateTime && { dateTime: new Date(data.meetingDateTime) }), ...(data.meetingPurpose && { purpose: data.meetingPurpose }), ...(data.meetingStatus && { status: data.meetingStatus as "scheduled" | "completed" | "cancelled" }) } : m) })) },
      deleteMeeting: async (id) => { await meetingsApi.delete(parseInt(id)); set(s => ({ meetings: s.meetings.filter(m => m.id !== id) })) },
      updateAttendance: async (meetingId, attendances) => { await attendanceApi.updateAttendance(parseInt(meetingId), attendances); const all = await meetingsApi.getAll(); set({ meetings: all.map(toMeeting) }) },
    }),
    {
      name: "spms-storage",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated, token: state.token, }),
      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          setToken(state.token) // 🔥 Restore JWT header
        }
      },
    }
  )
)
