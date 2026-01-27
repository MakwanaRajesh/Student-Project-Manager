-- =====================================
-- DATABASE
-- =====================================
DROP DATABASE IF EXISTS spms;
CREATE DATABASE spms;
USE spms;



CREATE TABLE UserLogin (
    UserLoginID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT NOT NULL,
    UserRole ENUM('admin','faculty','student') NOT NULL,
    Email VARCHAR(200) NOT NULL UNIQUE,
    PasswordHash VARCHAR(255) NOT NULL,
    IsActive BOOLEAN DEFAULT 1,
    LastLogin DATETIME,
    Created DATETIME DEFAULT CURRENT_TIMESTAMP,
    Modified DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


INSERT INTO UserLogin
(UserID, UserRole, Email, PasswordHash, IsActive)
VALUES
-- ================= ADMIN =================
(1, 'admin', 'admin@university.edu', 'admin123', 1),

-- ================= FACULTY =================
(1, 'faculty', 'amit@college.edu', 'amit123', 1),
(2, 'faculty', 'neha@college.edu', 'neha123', 1),
(3, 'faculty', 'rahul@college.edu', 'rahul123', 1),

-- ================= STUDENT =================
(1, 'student', 'rajesh@student.edu', 'student123', 1),
(2, 'student', 'amit@student.edu', 'student123', 1),
(3, 'student', 'sneha@student.edu', 'student123', 1);






-- =====================================
-- ProjectType
-- =====================================
CREATE TABLE ProjectType (
    ProjectTypeID INT AUTO_INCREMENT PRIMARY KEY,
    ProjectTypeName VARCHAR(100) NOT NULL,
    Description TEXT,
    Created DATETIME DEFAULT CURRENT_TIMESTAMP,
    Modified DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
SELECT * FROM ProjectType;

INSERT INTO ProjectType (ProjectTypeName, Description) VALUES
('Major Project', 'Final year major project'),
('Mini Project', 'Mini academic project'),
('Research Project', 'Research based project');

-- =====================================
-- Staff
-- =====================================
CREATE TABLE Staff (
    StaffID INT AUTO_INCREMENT PRIMARY KEY,
    StaffName VARCHAR(200) NOT NULL,
    Phone VARCHAR(20),
    Email VARCHAR(200),
    Password VARCHAR(100),
    Description TEXT,
    Created DATETIME DEFAULT CURRENT_TIMESTAMP,
    Modified DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO Staff (StaffName, Phone, Email, Password, Description) VALUES
('Dr. Amit Sharma', '9876543210', 'amit@college.edu', 'amit123', 'Project Guide'),
('Prof. Neha Patel', '9876501234', 'neha@college.edu', 'neha123', 'Project Convener'),
('Dr. Rahul Mehta', '9876598765', 'rahul@college.edu', 'rahul123', 'Project Expert');

-- =====================================
-- Student
-- =====================================
CREATE TABLE Student (
    StudentID INT AUTO_INCREMENT PRIMARY KEY,
    StudentName VARCHAR(200) NOT NULL,
    Phone VARCHAR(20),
    Email VARCHAR(200),
    Description TEXT,
    Created DATETIME DEFAULT CURRENT_TIMESTAMP,
    Modified DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

select * from Student
INSERT INTO Student (StudentName, Phone, Email, Description) VALUES
('Rajesh Kumar', '9999990001', 'rajesh@student.edu', 'Group Leader'),
('Amit Verma', '9999990002', 'amit@student.edu', 'Group Member'),
('Sneha Patel', '9999990003', 'sneha@student.edu', 'Group Member');

-- =====================================
-- ProjectGroup
-- =====================================
CREATE TABLE ProjectGroup (
    ProjectGroupID INT AUTO_INCREMENT PRIMARY KEY,
    ProjectGroupName VARCHAR(200) NOT NULL,
    ProjectTypeID INT NOT NULL,
    GuideStaffID INT,
    ProjectTitle VARCHAR(300),
    ProjectArea VARCHAR(200),
    ProjectDescription TEXT,
    AverageCPI DECIMAL(4,2),
    ConvenerStaffID INT,
    ExpertStaffID INT,
    Description TEXT,
    Created DATETIME DEFAULT CURRENT_TIMESTAMP,
    Modified DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (ProjectTypeID) REFERENCES ProjectType(ProjectTypeID),
    FOREIGN KEY (GuideStaffID) REFERENCES Staff(StaffID),
    FOREIGN KEY (ConvenerStaffID) REFERENCES Staff(StaffID),
    FOREIGN KEY (ExpertStaffID) REFERENCES Staff(StaffID)
);
UPDATE ProjectGroup
SET Description = 'Pending'
WHERE ProjectGroupID = 1;

ALTER TABLE ProjectGroup
ADD Status ENUM('pending','approved','rejected') DEFAULT 'pending';

select * from ProjectGroup

INSERT INTO ProjectGroup
(ProjectGroupName, ProjectTypeID, GuideStaffID, ProjectTitle, ProjectArea, ProjectDescription, AverageCPI, ConvenerStaffID, ExpertStaffID, Description)
VALUES
('SPMS Group A', 1, 1, 'Student Project Management System', 'Web Development',
 'A system to manage student academic projects', 7.25, 2, 3, 'Approved Project');

-- =====================================
-- ProjectGroupMember
-- =====================================
CREATE TABLE ProjectGroupMember (
    ProjectGroupMemberID INT AUTO_INCREMENT PRIMARY KEY,
    ProjectGroupID INT NOT NULL,
    StudentID INT NOT NULL,
    IsGroupLeader BOOLEAN DEFAULT 0,
    StudentCGPA DECIMAL(4,2),
    Description TEXT,
    Created DATETIME DEFAULT CURRENT_TIMESTAMP,
    Modified DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (ProjectGroupID) REFERENCES ProjectGroup(ProjectGroupID),
    FOREIGN KEY (StudentID) REFERENCES Student(StudentID)
);

INSERT INTO ProjectGroupMember
(ProjectGroupID, StudentID, IsGroupLeader, StudentCGPA, Description)
VALUES
(1, 1, 1, 7.80, 'Team Leader'),
(1, 2, 0, 7.10, 'Backend Developer'),
(1, 3, 0, 6.85, 'Frontend Developer');

-- =====================================
-- ProjectMeeting
-- =====================================
CREATE TABLE ProjectMeeting (
    ProjectMeetingID INT AUTO_INCREMENT PRIMARY KEY,
    ProjectGroupID INT NOT NULL,
    GuideStaffID INT NOT NULL,
    MeetingDateTime DATETIME,
    MeetingPurpose VARCHAR(300),
    MeetingLocation VARCHAR(200),
    MeetingNotes TEXT,
    MeetingStatus VARCHAR(50),
    MeetingStatusDescription TEXT,
    MeetingStatusDatetime DATETIME,
    Description TEXT,
    Created DATETIME DEFAULT CURRENT_TIMESTAMP,
    Modified DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (ProjectGroupID) REFERENCES ProjectGroup(ProjectGroupID),
    FOREIGN KEY (GuideStaffID) REFERENCES Staff(StaffID)
);

INSERT INTO ProjectMeeting
(ProjectGroupID, GuideStaffID, MeetingDateTime, MeetingPurpose, MeetingLocation, MeetingNotes, MeetingStatus, MeetingStatusDescription, MeetingStatusDatetime, Description)
VALUES
(1, 1, NOW(), 'Project Discussion', 'Lab 101',
 'Discussed database design and UI flow', 'Completed',
 'Meeting successfully completed', NOW(), 'Week 2 Meeting');
 
 INSERT INTO ProjectMeeting
(
    ProjectGroupID,
    GuideStaffID,
    MeetingDateTime,
    MeetingPurpose,
    MeetingLocation,
    MeetingNotes,
    MeetingStatus,
    MeetingStatusDescription,
    MeetingStatusDatetime,
    Description
)
VALUES
-- Meeting 1
(1, 2,
 '2026-01-15 10:30:00',
 'Project Requirement Discussion',
 'Seminar Hall - A',
 'Discussed project scope and requirements',
 'Completed',
 'Meeting completed successfully',
 '2026-01-15 12:00:00',
 'Initial discussion with project guide'),

-- Meeting 2
(2, 3,
 '2026-01-18 14:00:00',
 'Database Design Review',
 'Lab 3',
 'Reviewed ER diagram and tables',
 'Completed',
 'Database design approved',
 '2026-01-18 15:30:00',
 'Focused on normalization and relationships'),

-- Meeting 3
(3, 1,
 '2026-01-22 11:00:00',
 'API Planning',
 'Online - Google Meet',
 'Discussed API structure and endpoints',
 'Scheduled',
 'Meeting scheduled for discussion',
 '2026-01-22 11:00:00',
 'Backend API planning meeting'),

-- Meeting 4
(1, 2,
 '2026-01-25 09:30:00',
 'UI Review',
 'Computer Lab 2',
 'UI screens reviewed and suggestions given',
 'Scheduled',
 'Pending UI review',
 '2026-01-25 09:30:00',
 'Frontend UI discussion'),

-- Meeting 5
(4, 4,
 '2026-01-20 13:00:00',
 'Progress Evaluation',
 'Guide Cabin',
 'Checked current project progress',
 'Cancelled',
 'Meeting cancelled due to staff unavailability',
 '2026-01-20 12:30:00',
 'Meeting postponed');


-- =====================================
-- ProjectMeetingAttendance
-- =====================================
CREATE TABLE ProjectMeetingAttendance (
    ProjectMeetingAttendanceID INT AUTO_INCREMENT PRIMARY KEY,
    ProjectMeetingID INT NOT NULL,
    StudentID INT NOT NULL,
    IsPresent BOOLEAN DEFAULT 1,
    AttendanceRemarks VARCHAR(200),
    Description TEXT,
    Created DATETIME DEFAULT CURRENT_TIMESTAMP,
    Modified DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (ProjectMeetingID) REFERENCES ProjectMeeting(ProjectMeetingID),
    FOREIGN KEY (StudentID) REFERENCES Student(StudentID)
);

INSERT INTO ProjectMeetingAttendance
(ProjectMeetingID, StudentID, IsPresent, AttendanceRemarks, Description)
VALUES
(1, 1, 1, 'On Time', 'Present'),
(1, 2, 1, 'On Time', 'Present'),
(1, 3, 0, 'Absent', 'Not Present');
