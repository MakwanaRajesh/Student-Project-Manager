// import { db } from "@/lib/db";
// import { NextResponse } from "next/server";

// export async function GET(
//   request: Request
// //   { params }: { params: { id: string } }
// ) {
//   try {
//     const url = new URL(request.url);
//     const pathSegments = url.pathname.split('/');
//     const meetingId = pathSegments[pathSegments.length - 1];
//     // const meetingId = Number(params.id);

//     console.log("ProjectMeeting ID:", meetingId);
//     console.log("Type of meetingId:", typeof meetingId);

//     // validation
//     // if (isNaN(meetingId)) {
//     //   return NextResponse.json(
//     //     { error: "Invalid ProjectMeeting ID" },
//     //     { status: 400 }
//     //   );
//     // }

//     if (!meetingId || isNaN(parseInt(meetingId))) {
//       return NextResponse.json(
//         { message: "Valid Meeting ID is required" },
//         { status: 400 }
//       );
//     }

//     const [rows]: any = await db.query(
//     //   `
//     //   SELECT
//     //     pm.ProjectMeetingID,
//     //     pm.ProjectGroupID,
//     //     s.StaffName AS GuideStaffName,
//     //     pm.MeetingDateTime,
//     //     pm.MeetingPurpose,
//     //     pm.MeetingLocation,
//     //     pm.MeetingNotes,
//     //     pm.MeetingStatus,
//     //     pm.MeetingStatusDescription,
//     //     pm.MeetingStatusDatetime,
//     //     pm.Description
//     //   FROM ProjectMeeting pm
//     //   JOIN Staff s ON s.StaffID = pm.GuideStaffID
//     //   WHERE pm.ProjectMeetingID = ?
//     //   `,
//     "SELECT * FROM ProjectMeeting WHERE ProjectMeetingID = ?"
//       [parseInt(meetingId)]
//     );

//     const meetingArray= rows as any[];

//     if (!meetingArray.length) {
//       return NextResponse.json(
//         { message: "Project Meeting not found" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json(meetingArray[0]);
//   } catch (error) {
//     console.error("ProjectMeeting [id] GET error", error);
//     return NextResponse.json(
//       { message: "Failed to fetch Project Meeting" },
//       { status: 500 }
//     );
//   }
// }


import { db } from "@/lib/db"
import { NextResponse } from "next/server"

/* =====================================
   GET: Single meeting by ID
===================================== */
// export async function GET(
//   req: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const [rows]: any = await db.query(
//       `
//       SELECT
//         pm.*,
//         pg.ProjectGroupName,
//         s.StaffName AS GuideName
//       FROM ProjectMeeting pm
//       JOIN ProjectGroup pg ON pg.ProjectGroupID = pm.ProjectGroupID
//       JOIN Staff s ON s.StaffID = pm.GuideStaffID
//       WHERE pm.ProjectMeetingID = ?
//       `,
//       [params.id]
//     )

//     if (rows.length === 0) {
//       return NextResponse.json(
//         { error: "Project meeting not found" },
//         { status: 404 }
//       )
//     }

//     return NextResponse.json(rows[0])
//   } catch (error) {
//     console.error("ProjectMeeting GET by ID error:", error)
//     return NextResponse.json(
//       { error: "Failed to fetch project meeting" },
//       { status: 500 }
//     )
//   }
// }

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
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json()

    await db.query(
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
        Description = ?
      WHERE ProjectMeetingID = ?
      `,
      [
        body.MeetingDateTime,
        body.MeetingPurpose,
        body.MeetingLocation,
        body.MeetingNotes,
        body.MeetingStatus,
        body.MeetingStatusDescription,
        body.MeetingStatusDatetime,
        body.Description,
        params.id
      ]
    )

    return NextResponse.json({
      message: "Project meeting updated successfully"
    })
  } catch (error) {
    console.error("ProjectMeeting PUT error:", error)
    return NextResponse.json(
      { error: "Failed to update project meeting" },
      { status: 500 }
    )
  }
}

/* =====================================
   DELETE: Delete meeting
===================================== */
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await db.query(
      "DELETE FROM ProjectMeeting WHERE ProjectMeetingID = ?",
      [params.id]
    )

    return NextResponse.json({
      message: "Project meeting deleted successfully"
    })
  } catch (error) {
    console.error("ProjectMeeting DELETE error:", error)
    return NextResponse.json(
      { error: "Failed to delete project meeting" },
      { status: 500 }
    )
  }
}
