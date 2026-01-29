import { db } from "@/lib/db"
import { NextResponse } from "next/server"

/* =====================================
   GET: Single meeting by ID
===================================== */

export async function GET(request: Request) {
  try {
    // Parse the ID from the URL
    const url = new URL(request.url);
    const pathSegments = url.pathname.split('/');
    const ProjectMeetingID = pathSegments[pathSegments.length - 1];

    console.log("Extracted ProjectMeeting ID:", ProjectMeetingID);

    if (!ProjectMeetingID || isNaN(parseInt(ProjectMeetingID))) {
      return NextResponse.json(
        { message: "Valid ProjectMeeting ID is required" },
        { status: 400 }
      );
    }

    const [rows] = await db.query(
      `
      SELECT
        pm.*,
        pg.ProjectGroupName,
        s.StaffName AS GuideName
      FROM ProjectMeeting pm
      JOIN ProjectGroup pg ON pg.ProjectGroupID = pm.ProjectGroupID
      JOIN Staff s ON s.StaffID = pm.GuideStaffID
      WHERE pm.ProjectMeetingID = ?`,
      [parseInt(ProjectMeetingID)]
    );

    const ProjectMeetingArray = rows as any[];

    if (!ProjectMeetingArray.length) {
      return NextResponse.json(
        { message: "Student not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(ProjectMeetingArray[0]);
  } catch (error) {
    console.error("Error fetching student:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}



/* =====================================
   PUT: Update meeting
===================================== */
export async function PUT(request: Request) {
  try {
    const url = new URL(request.url)
    const ProjectMeetingID = Number(url.pathname.split("/").pop())

    if (!ProjectMeetingID || isNaN(ProjectMeetingID)) {
      return NextResponse.json(
        { message: "Valid ProjectMeeting ID is required" },
        { status: 400 }
      )
    }

    const body = await request.json()

    const {
      MeetingDateTime,
      MeetingPurpose,
      MeetingLocation,
      MeetingNotes,
      MeetingStatus,
      MeetingStatusDescription,
      MeetingStatusDatetime,
      Description
    } = body

    const [result]: any = await db.query(
      `
      UPDATE ProjectMeeting
      SET
        MeetingDateTime = ?,
        MeetingPurpose = ?,
        MeetingLocation = ?,
        MeetingNotes = ?,
        MeetingStatus = ?,
        MeetingStatusDescription = ?,
        MeetingStatusDatetime = ?,
        Description = ?,
        Modified = NOW()
      WHERE ProjectMeetingID = ?
      `,
      [
        MeetingDateTime ? new Date(MeetingDateTime) : null,
        MeetingPurpose ?? null,
        MeetingLocation ?? null,
        MeetingNotes ?? null,
        MeetingStatus ?? null,
        MeetingStatusDescription ?? null,
        MeetingStatusDatetime ? new Date(MeetingStatusDatetime) : null,
        Description ?? null,
        ProjectMeetingID
      ]
    )

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: "ProjectMeeting not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      message: "Project meeting updated successfully"
    })
  } catch (error) {
    console.error("❌ ProjectMeeting PUT error:", error)
    return NextResponse.json(
      { message: "Failed to update project meeting" },
      { status: 500 }
    )
  }
}



/* =====================================
   DELETE: Delete meeting
===================================== */
export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url)
    const ProjectMeetingID = Number(url.pathname.split("/").pop())

    if (!ProjectMeetingID || isNaN(ProjectMeetingID)) {
      return NextResponse.json(
        { message: "Valid ProjectMeeting ID is required" },
        { status: 400 }
      )
    }

    const [result]: any = await db.query(
      `DELETE FROM ProjectMeeting WHERE ProjectMeetingID = ?`,
      [ProjectMeetingID]
    )

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: "ProjectMeeting not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      message: "Project meeting deleted successfully"
    })
  } catch (error) {
    console.error("ProjectMeeting DELETE error:", error)
    return NextResponse.json(
      { message: "Failed to delete project meeting" },
      { status: 500 }
    )
  }
}
