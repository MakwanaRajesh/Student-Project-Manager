# SPMS Backend - .NET 8 Web API

## Student Project Management System - REST API

### Prerequisites
- .NET 8 SDK
- MySQL 8.0+

### Setup

1. **Update Database Connection** in `appsettings.json`:
```json
"ConnectionStrings": {
  "DefaultConnection": "server=localhost;port=3306;database=SPMSDB;user=root;password=YourPassword;"
}
```

2. **Run the Application**:
```bash
dotnet restore
dotnet run
```
The app will auto-migrate and seed the database on first run.

3. **Swagger UI**: Open `http://localhost:5000/swagger`

---

### Default Login Credentials

| Role    | Email                        | Password     |
|---------|------------------------------|--------------|
| Admin   | admin@university.edu         | Admin@123    |
| Faculty | rajesh.kumar@university.edu  | Faculty@123  |
| Faculty | priya.sharma@university.edu  | Faculty@123  |
| Student | arjun.m@student.edu          | Student@123  |
| Student | sneha.r@student.edu          | Student@123  |
| Student | vikram.s@student.edu         | Student@123  |
| Student | ananya.g@student.edu         | Student@123  |

---

### API Endpoints

#### Auth
| Method | Endpoint          | Description           | Auth Required |
|--------|-------------------|-----------------------|---------------|
| POST   | /api/auth/login   | Login (all roles)     | No            |

**Login Request Body:**
```json
{
  "email": "admin@university.edu",
  "password": "Admin@123",
  "role": "admin"
}
```
Role values: `"admin"`, `"faculty"`, `"student"`

---

#### Staff (Faculty/Admin)
| Method | Endpoint                   | Description          | Auth        |
|--------|----------------------------|----------------------|-------------|
| GET    | /api/staff                 | Get all staff        | Any         |
| GET    | /api/staff/{id}            | Get staff by ID      | Any         |
| POST   | /api/staff                 | Create staff         | Admin only  |
| PUT    | /api/staff/{id}            | Update staff         | Admin only  |
| DELETE | /api/staff/{id}            | Delete staff         | Admin only  |
| POST   | /api/staff/{id}/reset-password | Reset password   | Admin only  |

---

#### Students
| Method | Endpoint                       | Description            | Auth       |
|--------|--------------------------------|------------------------|------------|
| GET    | /api/students                  | Get all students       | Any        |
| GET    | /api/students/{id}             | Get student by ID      | Any        |
| GET    | /api/students/by-email/{email} | Get student by email   | Any        |
| POST   | /api/students                  | Create student         | Admin only |
| PUT    | /api/students/{id}             | Update student         | Admin only |
| DELETE | /api/students/{id}             | Delete student         | Admin only |

---

#### Project Types
| Method | Endpoint                  | Description        | Auth       |
|--------|---------------------------|--------------------|------------|
| GET    | /api/projecttypes         | Get all types      | Any        |
| GET    | /api/projecttypes/{id}    | Get type by ID     | Any        |
| POST   | /api/projecttypes         | Create type        | Admin only |
| PUT    | /api/projecttypes/{id}    | Update type        | Admin only |
| DELETE | /api/projecttypes/{id}    | Delete type        | Admin only |

---

#### Project Groups
| Method | Endpoint                          | Description             | Auth           |
|--------|-----------------------------------|-------------------------|----------------|
| GET    | /api/projectgroups                | Get all groups          | Any            |
| GET    | /api/projectgroups/{id}           | Get group by ID         | Any            |
| GET    | /api/projectgroups/by-staff/{id}  | Get groups by guide     | Any            |
| GET    | /api/projectgroups/by-student/{id}| Get groups by student   | Any            |
| POST   | /api/projectgroups                | Create group            | Any (Student)  |
| PUT    | /api/projectgroups/{id}           | Update group            | Any            |
| PATCH  | /api/projectgroups/{id}/status    | Approve/Reject group    | Admin/Faculty  |
| DELETE | /api/projectgroups/{id}           | Delete group            | Admin only     |

**Status Update Body:**
```json
{
  "status": "approved",
  "statusDescription": "Project looks good!"
}
```

---

#### Group Members
| Method | Endpoint                               | Description              | Auth |
|--------|----------------------------------------|--------------------------|------|
| GET    | /api/groupmembers/by-group/{groupId}   | Get members of a group   | Any  |
| POST   | /api/groupmembers/add-to-group/{id}    | Add member to group      | Any  |
| DELETE | /api/groupmembers/{id}                 | Remove member            | Any  |

---

#### Meetings
| Method | Endpoint                        | Description              | Auth |
|--------|---------------------------------|--------------------------|------|
| GET    | /api/meetings                   | Get all meetings         | Any  |
| GET    | /api/meetings/{id}              | Get meeting by ID        | Any  |
| GET    | /api/meetings/by-group/{id}     | Get meetings by group    | Any  |
| GET    | /api/meetings/by-staff/{id}     | Get meetings by faculty  | Any  |
| GET    | /api/meetings/by-student/{id}   | Get meetings by student  | Any  |
| POST   | /api/meetings                   | Schedule meeting         | Any  |
| PUT    | /api/meetings/{id}              | Update meeting           | Any  |
| DELETE | /api/meetings/{id}              | Delete meeting           | Any  |

---

#### Attendance
| Method | Endpoint                               | Description                | Auth |
|--------|----------------------------------------|----------------------------|------|
| GET    | /api/attendance/by-meeting/{meetingId} | Get attendance for meeting | Any  |
| GET    | /api/attendance/by-student/{studentId} | Get student's attendance   | Any  |
| POST   | /api/attendance/update/{meetingId}     | Save attendance            | Any  |
| GET    | /api/attendance/report/by-group/{id}  | Attendance report          | Any  |

**Update Attendance Body:**
```json
{
  "attendances": [
    { "studentId": 1, "isPresent": true, "attendanceRemarks": "On time" },
    { "studentId": 2, "isPresent": false, "attendanceRemarks": "Absent" }
  ]
}
```

---

#### Reports
| Method | Endpoint                          | Description             | Auth |
|--------|-----------------------------------|-------------------------|------|
| GET    | /api/reports/dashboard-stats      | Overall statistics      | Any  |
| GET    | /api/reports/attendance-summary   | Attendance by group     | Any  |
| GET    | /api/reports/project-types-breakdown | Stats by project type | Any  |

---

### JWT Authentication
After login, use the token in the Authorization header:
```
Authorization: Bearer {your-token-here}
```

### CORS
CORS is configured to allow all origins (for development). Update in `Program.cs` for production.
