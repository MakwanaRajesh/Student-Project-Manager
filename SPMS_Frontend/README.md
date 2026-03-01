# SPMS Frontend - Next.js

## Student Project Management System - Frontend

### Prerequisites
- Node.js 18+
- pnpm (recommended) or npm
- Backend API running on http://localhost:5000

### Setup

1. **Install dependencies:**
```bash
pnpm install
# or
npm install
```

2. **Configure API URL** in `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

3. **Run development server:**
```bash
pnpm dev
# or
npm run dev
```

4. Open `http://localhost:3000`

---

### Demo Login

Make sure the backend is running first, then use these credentials:

| Role    | Email                        | Password     |
|---------|------------------------------|--------------|
| Admin   | admin@university.edu         | Admin@123    |
| Faculty | rajesh.kumar@university.edu  | Faculty@123  |
| Student | arjun.m@student.edu          | Student@123  |

Or use the "Quick Demo Access" buttons on the login page.

---

### Architecture

- **Framework:** Next.js 16 with App Router
- **State Management:** Zustand (with API integration)
- **UI:** Tailwind CSS + shadcn/ui
- **API Layer:** `/lib/api.ts` - centralized fetch functions
- **Store:** `/lib/store.ts` - Zustand store connected to real API

### Key Features

**Admin:**
- Dashboard with real stats
- Staff management (CRUD)
- Student management (CRUD)
- Project type management
- All groups overview
- Approvals management
- Attendance reports
- Meetings overview

**Faculty:**
- Personal dashboard
- My guided groups
- All groups view
- Schedule meetings
- Mark attendance
- Approvals (convener/expert role)
- Reports

**Student:**
- Personal dashboard
- My projects / group membership
- Meeting history & upcoming meetings
- Submit project proposals
- Join groups

### Notes

- JWT token is stored in localStorage as `spms_token`
- Data is loaded once after login via `DataLoader` component
- All CRUD operations call real API endpoints
