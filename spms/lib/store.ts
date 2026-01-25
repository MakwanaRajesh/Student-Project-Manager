"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

// Types
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
  description: string
  members: ProjectGroupMember[]
  created: Date
  modified: Date
}

export interface ProjectMeeting {
  id: string
  groupId: string
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
  isPresent: boolean
  remarks: string
}

interface AppState {
  // Auth
  user: User | null
  isAuthenticated: boolean
  login: (user: User) => void
  logout: () => void

  // Project Types
  projectTypes: ProjectType[]
  addProjectType: (type: Omit<ProjectType, "id" | "created" | "modified">) => void
  updateProjectType: (id: string, type: Partial<ProjectType>) => void
  deleteProjectType: (id: string) => void

  // Staff
  staff: Staff[]
  addStaff: (staff: Omit<Staff, "id" | "created" | "modified">) => void
  updateStaff: (id: string, staff: Partial<Staff>) => void
  deleteStaff: (id: string) => void

  // Students
  students: Student[]
  addStudent: (student: Omit<Student, "id" | "created" | "modified">) => void
  updateStudent: (id: string, student: Partial<Student>) => void
  deleteStudent: (id: string) => void

  // Project Groups
  projectGroups: ProjectGroup[]
  addProjectGroup: (group: Omit<ProjectGroup, "id" | "created" | "modified">) => void
  updateProjectGroup: (id: string, group: Partial<ProjectGroup>) => void
  deleteProjectGroup: (id: string) => void
  approveProjectGroup: (id: string) => void
  rejectProjectGroup: (id: string) => void

  // Meetings
  meetings: ProjectMeeting[]
  addMeeting: (meeting: Omit<ProjectMeeting, "id" | "created" | "modified">) => void
  updateMeeting: (id: string, meeting: Partial<ProjectMeeting>) => void
  deleteMeeting: (id: string) => void
  updateAttendance: (meetingId: string, attendance: MeetingAttendance[]) => void
}

// Generate unique ID
const generateId = () => Math.random().toString(36).substr(2, 9)

// Sample data
const sampleProjectTypes: ProjectType[] = [
  {
    id: "1",
    name: "Major Project",
    description: "Final year major project",
    created: new Date(),
    modified: new Date(),
  },
  { id: "2", name: "Mini Project", description: "Semester mini project", created: new Date(), modified: new Date() },
  {
    id: "3",
    name: "Research Project",
    description: "Research and development project",
    created: new Date(),
    modified: new Date(),
  },
]

const sampleStaff: Staff[] = [
  {
    id: "1",
    name: "Dr. Rajesh Kumar",
    email: "rajesh.kumar@university.edu",
    phone: "9876543210",
    description: "Professor - Computer Science",
    created: new Date(),
    modified: new Date(),
  },
  {
    id: "2",
    name: "Dr. Priya Sharma",
    email: "priya.sharma@university.edu",
    phone: "9876543211",
    description: "Associate Professor - AI/ML",
    created: new Date(),
    modified: new Date(),
  },
  {
    id: "3",
    name: "Prof. Amit Patel",
    email: "amit.patel@university.edu",
    phone: "9876543212",
    description: "Professor - Software Engineering",
    created: new Date(),
    modified: new Date(),
  },
  {
    id: "4",
    name: "Dr. Neha Singh",
    email: "neha.singh@university.edu",
    phone: "9876543213",
    description: "Assistant Professor - Data Science",
    created: new Date(),
    modified: new Date(),
  },
]

const sampleStudents: Student[] = [
  {
    id: "1",
    name: "Arjun Mehta",
    email: "arjun.m@student.edu",
    phone: "9123456780",
    description: "CSE - 4th Year",
    cgpa: 8.5,
    created: new Date(),
    modified: new Date(),
  },
  {
    id: "2",
    name: "Sneha Reddy",
    email: "sneha.r@student.edu",
    phone: "9123456781",
    description: "CSE - 4th Year",
    cgpa: 9.1,
    created: new Date(),
    modified: new Date(),
  },
  {
    id: "3",
    name: "Vikram Singh",
    email: "vikram.s@student.edu",
    phone: "9123456782",
    description: "CSE - 4th Year",
    cgpa: 8.8,
    created: new Date(),
    modified: new Date(),
  },
  {
    id: "4",
    name: "Ananya Gupta",
    email: "ananya.g@student.edu",
    phone: "9123456783",
    description: "CSE - 4th Year",
    cgpa: 9.3,
    created: new Date(),
    modified: new Date(),
  },
  {
    id: "5",
    name: "Rohan Joshi",
    email: "rohan.j@student.edu",
    phone: "9123456784",
    description: "CSE - 3rd Year",
    cgpa: 8.2,
    created: new Date(),
    modified: new Date(),
  },
  {
    id: "6",
    name: "Kavya Nair",
    email: "kavya.n@student.edu",
    phone: "9123456785",
    description: "CSE - 3rd Year",
    cgpa: 8.9,
    created: new Date(),
    modified: new Date(),
  },
]

const sampleProjectGroups: ProjectGroup[] = [
  {
    id: "1",
    name: "Team Alpha",
    projectTypeId: "1",
    guideStaffId: "1",
    guideStaffName: "Dr. Rajesh Kumar",
    projectTitle: "AI-Powered Student Analytics",
    projectArea: "Artificial Intelligence",
    projectDescription:
      "Developing an AI system to analyze student performance and provide personalized recommendations.",
    averageCpi: 8.7,
    convenerStaffId: "3",
    expertStaffId: "2",
    status: "approved",
    description: "",
    members: [
      { id: "1", groupId: "1", studentId: "1", isGroupLeader: true, cgpa: 8.5, description: "" },
      { id: "2", groupId: "1", studentId: "2", isGroupLeader: false, cgpa: 9.1, description: "" },
    ],
    created: new Date(),
    modified: new Date(),
  },
  {
    id: "2",
    name: "Team Beta",
    projectTypeId: "1",
    guideStaffId: "2",
    guideStaffName: "Dr. Priya Sharma",
    projectTitle: "Smart Campus Navigation",
    projectArea: "Mobile Development",
    projectDescription: "Building a mobile app for campus navigation with AR features.",
    averageCpi: 9.0,
    convenerStaffId: "1",
    expertStaffId: "4",
    status: "approved",
    description: "",
    members: [
      { id: "3", groupId: "2", studentId: "3", isGroupLeader: true, cgpa: 8.8, description: "" },
      { id: "4", groupId: "2", studentId: "4", isGroupLeader: false, cgpa: 9.3, description: "" },
    ],
    created: new Date(),
    modified: new Date(),
  },
  {
    id: "3",
    name: "Team Gamma",
    projectTypeId: "2",
    guideStaffId: "3",
    guideStaffName: "Prof. Amit Patel",
    projectTitle: "E-Learning Platform",
    projectArea: "Web Development",
    projectDescription: "Creating an interactive e-learning platform with video conferencing.",
    averageCpi: 8.5,
    status: "pending",
    description: "",
    members: [
      { id: "5", groupId: "3", studentId: "5", isGroupLeader: true, cgpa: 8.2, description: "" },
      { id: "6", groupId: "3", studentId: "6", isGroupLeader: false, cgpa: 8.9, description: "" },
    ],
    created: new Date(),
    modified: new Date(),
  },
]

const sampleMeetings: ProjectMeeting[] = [
  {
    id: "1",
    groupId: "1",
    guideStaffId: "1",
    dateTime: new Date(Date.now() + 86400000),
    purpose: "Project Progress Review",
    location: "Room 301, CS Building",
    notes: "Discuss progress on AI model training",
    status: "scheduled",
    statusDescription: "",
    attendance: [],
    created: new Date(),
    modified: new Date(),
  },
  {
    id: "2",
    groupId: "2",
    guideStaffId: "2",
    dateTime: new Date(Date.now() - 86400000),
    purpose: "Design Review",
    location: "Conference Room A",
    notes: "UI/UX review completed. Minor changes suggested.",
    status: "completed",
    statusDescription: "",
    attendance: [
      { id: "1", meetingId: "2", studentId: "3", isPresent: true, remarks: "" },
      { id: "2", meetingId: "2", studentId: "4", isPresent: true, remarks: "" },
    ],
    created: new Date(),
    modified: new Date(),
  },
]

export const useAppStore = create<AppState>()(
  
  persist(
    (set) => ({
      // Auth
      user: null,
      isAuthenticated: false,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),

      // Project Types
      projectTypes: sampleProjectTypes,
      addProjectType: (type) =>
        set((state) => ({
          projectTypes: [
            ...state.projectTypes,
            {
              ...type,
              id: generateId(),
              created: new Date(),
              modified: new Date(),
            },
          ],
        })),
      updateProjectType: (id, type) =>
        set((state) => ({
          projectTypes: state.projectTypes.map((t) => (t.id === id ? { ...t, ...type, modified: new Date() } : t)),
        })),
      deleteProjectType: (id) =>
        set((state) => ({
          projectTypes: state.projectTypes.filter((t) => t.id !== id),
        })),

      // Staff
      staff: sampleStaff,
      addStaff: (staff) =>
        set((state) => ({
          staff: [
            ...state.staff,
            {
              ...staff,
              id: generateId(),
              created: new Date(),
              modified: new Date(),
            },
          ],
        })),
      updateStaff: (id, staff) =>
        set((state) => ({
          staff: state.staff.map((s) => (s.id === id ? { ...s, ...staff, modified: new Date() } : s)),
        })),
      deleteStaff: (id) =>
        set((state) => ({
          staff: state.staff.filter((s) => s.id !== id),
        })),

      // Students
      students: sampleStudents,
      addStudent: (student) =>
        set((state) => ({
          students: [
            ...state.students,
            {
              ...student,
              id: generateId(),
              created: new Date(),
              modified: new Date(),
            },
          ],
        })),
      updateStudent: (id, student) =>
        set((state) => ({
          students: state.students.map((s) => (s.id === id ? { ...s, ...student, modified: new Date() } : s)),
        })),
      deleteStudent: (id) =>
        set((state) => ({
          students: state.students.filter((s) => s.id !== id),
        })),

      // Project Groups
      projectGroups: sampleProjectGroups,
      addProjectGroup: (group) =>
        set((state) => ({
          projectGroups: [
            ...state.projectGroups,
            {
              ...group,
              id: generateId(),
              created: new Date(),
              modified: new Date(),
            },
          ],
        })),
      updateProjectGroup: (id, group) =>
        set((state) => ({
          projectGroups: state.projectGroups.map((g) => (g.id === id ? { ...g, ...group, modified: new Date() } : g)),
        })),
      deleteProjectGroup: (id) =>
        set((state) => ({
          projectGroups: state.projectGroups.filter((g) => g.id !== id),
        })),
      approveProjectGroup: (id) =>
        set((state) => ({
          projectGroups: state.projectGroups.map((g) =>
            g.id === id ? { ...g, status: "approved", modified: new Date() } : g,
          ),
        })),
      rejectProjectGroup: (id) =>
        set((state) => ({
          projectGroups: state.projectGroups.map((g) =>
            g.id === id ? { ...g, status: "rejected", modified: new Date() } : g,
          ),
        })),

      // Meetings
      meetings: sampleMeetings,
      addMeeting: (meeting) =>
        set((state) => ({
          meetings: [
            ...state.meetings,
            {
              ...meeting,
              id: generateId(),
              created: new Date(),
              modified: new Date(),
            },
          ],
        })),
      updateMeeting: (id, meeting) =>
        set((state) => ({
          meetings: state.meetings.map((m) => (m.id === id ? { ...m, ...meeting, modified: new Date() } : m)),
        })),
      deleteMeeting: (id) =>
        set((state) => ({
          meetings: state.meetings.filter((m) => m.id !== id),
        })),
      updateAttendance: (meetingId, attendance) =>
        set((state) => ({
          meetings: state.meetings.map((m) => (m.id === meetingId ? { ...m, attendance, modified: new Date() } : m)),
        })),
    }),
    {
      name: "spms-storage",
    },
  ),
)
