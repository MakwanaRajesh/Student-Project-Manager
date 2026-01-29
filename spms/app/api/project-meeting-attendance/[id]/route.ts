import { db } from "@/lib/db"
import { NextResponse } from "next/server"

/* =====================================
   GET: Single attendance record
===================================== */

export async function GET(request: Request) {
    try {
        // Parse the ID from the URL
        const url = new URL(request.url);
        const pathSegments = url.pathname.split('/');
        const ProjectMeetingAttendanceID = pathSegments[pathSegments.length - 1];

        console.log("Extracted ProjectMeetingAttendance ID:", ProjectMeetingAttendanceID);

        if (!ProjectMeetingAttendanceID || isNaN(parseInt(ProjectMeetingAttendanceID))) {
            return NextResponse.json(
                { message: "Valid ProjectMeetingAttendance ID is required" },
                { status: 400 }
            );
        }

        const [rows] = await db.query(
            `
      SELECT
        pma.*,
        s.StudentName,
        pm.MeetingDateTime
      FROM ProjectMeetingAttendance pma
      JOIN Student s ON s.StudentID = pma.StudentID
      JOIN ProjectMeeting pm ON pm.ProjectMeetingID = pma.ProjectMeetingID
      WHERE pma.ProjectMeetingAttendanceID = ?`,
            [parseInt(ProjectMeetingAttendanceID)]
        );

        const ProjectMeetingAttendanceArray = rows as any[];

        if (!ProjectMeetingAttendanceArray.length) {
            return NextResponse.json(
                { message: "ProjectMeetingAttendance not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(ProjectMeetingAttendanceArray[0]);
    } catch (error) {
        console.error("Error fetching student:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}

/* =====================================
   PUT: Update attendance
===================================== */
export async function PUT(request: Request) {
  try {
    const url = new URL(request.url)
    const ProjectMeetingAttendanceID = Number(
      url.pathname.split("/").pop()
    )

    if (!ProjectMeetingAttendanceID || isNaN(ProjectMeetingAttendanceID)) {
      return NextResponse.json(
        { message: "Valid ProjectMeetingAttendance ID is required" },
        { status: 400 }
      )
    }

    const {
      IsPresent,
      AttendanceRemarks,
      Description
    } = await request.json()

    const [result]: any = await db.query(
      `
      UPDATE ProjectMeetingAttendance
      SET
        IsPresent = ?,
        AttendanceRemarks = ?,
        Description = ?,
        Modified = NOW()
      WHERE ProjectMeetingAttendanceID = ?
      `,
      [
        IsPresent,
        AttendanceRemarks ?? null,
        Description ?? null,
        ProjectMeetingAttendanceID
      ]
    )

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: "Attendance record not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      message: "Attendance updated successfully"
    })
  } catch (error) {
    console.error("ProjectMeetingAttendance PUT error:", error)
    return NextResponse.json(
      { message: "Failed to update attendance" },
      { status: 500 }
    )
  }
}


/* =====================================
   DELETE: Delete attendance
===================================== */
export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url)
    const ProjectMeetingAttendanceID = Number(
      url.pathname.split("/").pop()
    )

    if (!ProjectMeetingAttendanceID || isNaN(ProjectMeetingAttendanceID)) {
      return NextResponse.json(
        { message: "Valid ProjectMeetingAttendance ID is required" },
        { status: 400 }
      )
    }

    const [result]: any = await db.query(
      `
      DELETE FROM ProjectMeetingAttendance
      WHERE ProjectMeetingAttendanceID = ?
      `,
      [ProjectMeetingAttendanceID]
    )

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: "Attendance record not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      message: "Attendance record deleted successfully"
    })
  } catch (error) {
    console.error("ProjectMeetingAttendance DELETE error:", error)
    return NextResponse.json(
      { message: "Failed to delete attendance" },
      { status: 500 }
    )
  }
}

