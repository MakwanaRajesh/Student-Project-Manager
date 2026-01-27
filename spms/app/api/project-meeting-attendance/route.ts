// import { NextResponse } from "next/server";
// import { db } from "@/lib/db";

// export async function GET() {
//   const [rows] = await db.query("SELECT * FROM ProjectMeetingAttendance");
//   return NextResponse.json(rows);
// }

// export async function POST(req: Request) {
//   const { ProjectMeetingID, StudentID, IsPresent, AttendanceRemarks } =
//     await req.json();

//   await db.query(
//     `INSERT INTO ProjectMeetingAttendance
//      (ProjectMeetingID, StudentID, IsPresent, AttendanceRemarks)
//      VALUES (?,?,?,?)`,
//     [ProjectMeetingID, StudentID, IsPresent, AttendanceRemarks]
//   );

//   return NextResponse.json({ message: "Attendance Marked" });
// }


import { db } from "@/lib/db"
import { NextResponse } from "next/server"

/* =====================================
   GET: All attendance OR by MeetingID
===================================== */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const meetingId = searchParams.get("meetingId")

    let query = `
      SELECT
        pma.ProjectMeetingAttendanceID,
        pma.ProjectMeetingID,
        pm.MeetingDateTime,
        pma.StudentID,
        s.StudentName,
        pma.IsPresent,
        pma.AttendanceRemarks,
        pma.Description,
        pma.Created
      FROM ProjectMeetingAttendance pma
      JOIN Student s ON s.StudentID = pma.StudentID
      JOIN ProjectMeeting pm ON pm.ProjectMeetingID = pma.ProjectMeetingID
    `

    const params: any[] = []

    if (meetingId) {
      query += " WHERE pma.ProjectMeetingID = ?"
      params.push(meetingId)
    }

    query += " ORDER BY s.StudentName"

    const [rows] = await db.query(query, params)
    return NextResponse.json(rows)
  } catch (error) {
    console.error("ProjectMeetingAttendance GET error:", error)
    return NextResponse.json(
      { error: "Failed to fetch meeting attendance" },
      { status: 500 }
    )
  }
}

/* =====================================
   POST: Mark attendance
===================================== */
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      ProjectMeetingID,
      StudentID,
      IsPresent,
      AttendanceRemarks,
      Description
    } = body

    const [result]: any = await db.query(
      `
      INSERT INTO ProjectMeetingAttendance
      (
        ProjectMeetingID,
        StudentID,
        IsPresent,
        AttendanceRemarks,
        Description
      )
      VALUES (?, ?, ?, ?, ?)
      `,
      [
        ProjectMeetingID,
        StudentID,
        IsPresent,
        AttendanceRemarks,
        Description
      ]
    )

    return NextResponse.json({
      message: "Attendance marked successfully",
      ProjectMeetingAttendanceID: result.insertId
    })
  } catch (error) {
    console.error("ProjectMeetingAttendance POST error:", error)
    return NextResponse.json(
      { error: "Failed to mark attendance" },
      { status: 500 }
    )
  }
}
