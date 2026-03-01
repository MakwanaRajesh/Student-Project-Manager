// API Service Layer - connects frontend to .NET backend
// Base URL can be changed based on deployment

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

// ===== Token Management =====
export function getToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("spms_token")
}

export function setToken(token: string): void {
  localStorage.setItem("spms_token", token)
}

export function removeToken(): void {
  localStorage.removeItem("spms_token")
}

// ===== HTTP Client =====
async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  requireAuth = true,
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  }

  if (requireAuth) {
    const token = getToken()
    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!res.ok) {
    let errorMsg = `Request failed: ${res.status}`
    try {
      const errData = await res.json()
      errorMsg = errData?.message || errData?.title || JSON.stringify(errData)
    } catch {
      // ignore parse errors
    }
    throw new Error(errorMsg)
  }

  return res.json()
}

const api = {
  get: <T>(path: string) => request<T>("GET", path),
  post: <T>(path: string, body: unknown, requireAuth = true) =>
    request<T>("POST", path, body, requireAuth),
  put: <T>(path: string, body: unknown) => request<T>("PUT", path, body),
  patch: <T>(path: string, body: unknown) => request<T>("PATCH", path, body),
  delete: <T>(path: string) => request<T>("DELETE", path),
}

// ===== Types from backend =====
export interface ApiStaff {
  staffID: number
  staffName: string
  email: string
  phone?: string
  role: string
  description?: string
  created: string
  modified: string
}

export interface ApiStudent {
  studentID: number
  studentName: string
  email: string
  phone?: string
  cgpa: number
  description?: string
  created: string
  modified: string
}

export interface ApiProjectType {
  projectTypeID: number
  projectTypeName: string
  description?: string
  created: string
  modified: string
}

export interface ApiProjectGroupMember {
  projectGroupMemberID: number
  projectGroupID: number
  studentID: number
  studentName?: string
  studentEmail?: string
  studentPhone?: string
  isGroupLeader: boolean
  studentCGPA: number
  description?: string
  created: string
}

export interface ApiProjectGroup {
  projectGroupID: number
  projectGroupName: string
  projectTypeID: number
  projectTypeName?: string
  guideStaffID: number
  guideStaffName?: string
  projectTitle?: string
  projectArea?: string
  projectDescription?: string
  averageCPI: number
  convenerStaffID?: number
  convenerStaffName?: string
  expertStaffID?: number
  expertStaffName?: string
  status: string
  statusDescription?: string
  description?: string
  created: string
  modified: string
  members: ApiProjectGroupMember[]
}

export interface ApiMeetingAttendance {
  projectMeetingAttendanceID: number
  projectMeetingID: number
  studentID: number
  studentName?: string
  isPresent: boolean
  attendanceRemarks?: string
  created: string
}

export interface ApiMeeting {
  projectMeetingID: number
  projectGroupID: number
  groupName?: string
  guideStaffID: number
  guideStaffName?: string
  meetingDateTime: string
  meetingPurpose: string
  meetingLocation?: string
  meetingNotes?: string
  meetingStatus: string
  statusDescription?: string
  created: string
  modified: string
  attendances: ApiMeetingAttendance[]
}

export interface ApiDashboardStats {
  totalStudents: number
  totalStaff: number
  totalGroups: number
  pendingGroups: number
  approvedGroups: number
  rejectedGroups: number
  totalMeetings: number
  scheduledMeetings: number
  completedMeetings: number
}

export interface LoginResponse {
  success: boolean
  token: string
  role: string
  name: string
  email: string
  userId: number
}

// ===== Auth =====
export const authApi = {
  login: (email: string, password: string, role: string) =>
    api.post<LoginResponse>("/api/auth/login", { email, password, role }, false),
}

// ===== Staff =====
export const staffApi = {
  getAll: () => api.get<ApiStaff[]>("/api/staff"),
  getById: (id: number) => api.get<ApiStaff>(`/api/staff/${id}`),
  create: (data: {
    staffName: string
    email: string
    phone?: string
    password: string
    role: string
    description?: string
  }) => api.post<ApiStaff>("/api/staff", data),
  update: (
    id: number,
    data: { staffName: string; email: string; phone?: string; description?: string; role: string },
  ) => api.put<ApiStaff>(`/api/staff/${id}`, data),
  delete: (id: number) => api.delete<{ message: string }>(`/api/staff/${id}`),
  resetPassword: (id: number, newPassword: string) =>
    api.post<{ message: string }>(`/api/staff/${id}/reset-password`, { newPassword }),
}

// ===== Students =====
export const studentsApi = {
  getAll: () => api.get<ApiStudent[]>("/api/students"),
  getById: (id: number) => api.get<ApiStudent>(`/api/students/${id}`),
  getByEmail: (email: string) =>
    api.get<ApiStudent>(`/api/students/by-email/${encodeURIComponent(email)}`),
  create: (data: {
    studentName: string
    email: string
    phone?: string
    password: string
    description?: string
    cgpa: number
  }) => api.post<ApiStudent>("/api/students", data),
  update: (
    id: number,
    data: { studentName: string; email: string; phone?: string; description?: string; cgpa: number },
  ) => api.put<ApiStudent>(`/api/students/${id}`, data),
  delete: (id: number) => api.delete<{ message: string }>(`/api/students/${id}`),
}

// ===== Project Types =====
export const projectTypesApi = {
  getAll: () => api.get<ApiProjectType[]>("/api/projecttypes"),
  getById: (id: number) => api.get<ApiProjectType>(`/api/projecttypes/${id}`),
  create: (data: { projectTypeName: string; description?: string }) =>
    api.post<ApiProjectType>("/api/projecttypes", data),
  update: (id: number, data: { projectTypeName: string; description?: string }) =>
    api.put<ApiProjectType>(`/api/projecttypes/${id}`, data),
  delete: (id: number) => api.delete<{ message: string }>(`/api/projecttypes/${id}`),
}

// ===== Project Groups =====
export const projectGroupsApi = {
  getAll: () => api.get<ApiProjectGroup[]>("/api/projectgroups"),
  getById: (id: number) => api.get<ApiProjectGroup>(`/api/projectgroups/${id}`),
  getByStaff: (staffId: number) =>
    api.get<ApiProjectGroup[]>(`/api/projectgroups/by-staff/${staffId}`),
  getByStudent: (studentId: number) =>
    api.get<ApiProjectGroup[]>(`/api/projectgroups/by-student/${studentId}`),
  create: (data: {
    projectGroupName: string
    projectTypeID: number
    guideStaffID: number
    projectTitle?: string
    projectArea?: string
    projectDescription?: string
    convenerStaffID?: number
    expertStaffID?: number
    description?: string
    members: { studentID: number; isGroupLeader: boolean; studentCGPA: number; description?: string }[]
  }) => api.post<ApiProjectGroup>("/api/projectgroups", data),
  update: (id: number, data: unknown) => api.put<ApiProjectGroup>(`/api/projectgroups/${id}`, data),
  updateStatus: (id: number, status: string, statusDescription?: string) =>
    api.patch<{ status: string }>(`/api/projectgroups/${id}/status`, { status, statusDescription }),
  delete: (id: number) => api.delete<{ message: string }>(`/api/projectgroups/${id}`),
}

// ===== Meetings =====
export const meetingsApi = {
  getAll: () => api.get<ApiMeeting[]>("/api/meetings"),
  getById: (id: number) => api.get<ApiMeeting>(`/api/meetings/${id}`),
  getByGroup: (groupId: number) => api.get<ApiMeeting[]>(`/api/meetings/by-group/${groupId}`),
  getByStaff: (staffId: number) => api.get<ApiMeeting[]>(`/api/meetings/by-staff/${staffId}`),
  getByStudent: (studentId: number) => api.get<ApiMeeting[]>(`/api/meetings/by-student/${studentId}`),
  create: (data: {
    projectGroupID: number
    guideStaffID: number
    meetingDateTime: string
    meetingPurpose: string
    meetingLocation?: string
    meetingNotes?: string
  }) => api.post<ApiMeeting>("/api/meetings", data),
  update: (id: number, data: {
    meetingDateTime?: string
    meetingPurpose?: string
    meetingLocation?: string
    meetingNotes?: string
    meetingStatus?: string
    statusDescription?: string
  }) => api.put<ApiMeeting>(`/api/meetings/${id}`, data),
  delete: (id: number) => api.delete<{ message: string }>(`/api/meetings/${id}`),
}

// ===== Attendance =====
export const attendanceApi = {
  getByMeeting: (meetingId: number) =>
    api.get<ApiMeetingAttendance[]>(`/api/attendance/by-meeting/${meetingId}`),
  getByStudent: (studentId: number) =>
    api.get<ApiMeetingAttendance[]>(`/api/attendance/by-student/${studentId}`),
  updateAttendance: (
    meetingId: number,
    attendances: { studentID: number; isPresent: boolean; attendanceRemarks?: string }[],
  ) => api.post<{ message: string }>(`/api/attendance/update/${meetingId}`, { attendances }),
  getReportByGroup: (groupId: number) =>
    api.get<{ studentID: number; studentName: string; totalMeetings: number; attendedMeetings: number; attendancePercentage: number }[]>(
      `/api/attendance/report/by-group/${groupId}`,
    ),
}

// ===== Reports =====
export const reportsApi = {
  getDashboardStats: () => api.get<ApiDashboardStats>("/api/reports/dashboard-stats"),
  getAttendanceSummary: () => api.get<unknown[]>("/api/reports/attendance-summary"),
  getProjectTypesBreakdown: () => api.get<unknown[]>("/api/reports/project-types-breakdown"),
}
