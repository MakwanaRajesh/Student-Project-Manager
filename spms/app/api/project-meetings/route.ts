// import { db } from "@/lib/db";
// import { NextResponse } from "next/server";

// export async function GET() {
//   try {
//     const [data] = await db.query(`
//       SELECT
//         pm.ProjectMeetingID,
//         pm.ProjectGroupID,

//         pg.ProjectGroupName,
//         pg.ProjectTitle,

//         s.StaffID AS GuideStaffID,
//         s.StaffName AS GuideStaffName,

//         pm.MeetingDateTime,
//         pm.MeetingPurpose,
//         pm.MeetingLocation,
//         pm.MeetingNotes,
//         pm.MeetingStatus,
//         pm.MeetingStatusDescription,
//         pm.MeetingStatusDatetime,
//         pm.Description

//       FROM ProjectMeeting pm
//       JOIN ProjectGroup pg ON pg.ProjectGroupID = pm.ProjectGroupID
//       JOIN Staff s ON s.StaffID = pm.GuideStaffID
//       ORDER BY pm.MeetingDateTime DESC
//     `);

//     return NextResponse.json(data);
//   } catch (error) {
//     console.error("ProjectMeeting GET error", error);
//     return NextResponse.json(
//       { error: "Failed to fetch Project Meeting" },
//       { status: 500 }
//     );
//   }
// }

// export async function POST(req: Request) {
//   try {
//     const {
//       ProjectGroupID,
//       GuideStaffID,
//       MeetingDateTime,
//       MeetingPurpose,
//       MeetingLocation,
//       MeetingNotes,
//       MeetingStatus,
//       MeetingStatusDescription,
//       MeetingStatusDatetime,
//       Description
//     } = await req.json();

//     if (!ProjectGroupID || !GuideStaffID || !MeetingDateTime) {
//       return NextResponse.json(
//         { error: "Required fields missing" },
//         { status: 400 }
//       );
//     }

//     await db.query(
//       `INSERT INTO ProjectMeeting
//       (ProjectGroupID, GuideStaffID, MeetingDateTime, MeetingPurpose, MeetingLocation,
//        MeetingNotes, MeetingStatus, MeetingStatusDescription, MeetingStatusDatetime, Description)
//        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//       [
//         ProjectGroupID,
//         GuideStaffID,
//         MeetingDateTime,
//         MeetingPurpose,
//         MeetingLocation,
//         MeetingNotes,
//         MeetingStatus,
//         MeetingStatusDescription,
//         MeetingStatusDatetime,
//         Description
//       ]
//     );

//     return NextResponse.json(
//       { message: "New Project Meeting is Created" },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("Project Meeting POST error", error);
//     return NextResponse.json(
//       { error: "Failed to create Project Meeting" },
//       { status: 500 }
//     );
//   }
// }


// export function PUT() {
//   return NextResponse.json({ message: "PUT is Working..." })
// }

// export function DELETE() {
//   return NextResponse.json({ message: "DELETE is Working..." })
// }

// export function PATCH() {
//   return NextResponse.json({ message: "PATCH is Working..." })
// }

import { db } from "@/lib/db"
import { NextResponse } from "next/server"

/* =====================================
   GET: All meetings OR by ProjectGroupID
===================================== */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const groupId = searchParams.get("groupId")

    let query = `
      SELECT
        pm.ProjectMeetingID,
        pm.ProjectGroupID,
        pg.ProjectGroupName,
        pm.GuideStaffID,
        s.StaffName AS GuideName,
        pm.MeetingDateTime,
        pm.MeetingPurpose,
        pm.MeetingLocation,
        pm.MeetingNotes,
        pm.MeetingStatus,
        pm.MeetingStatusDescription,
        pm.MeetingStatusDatetime,
        pm.Description,
        pm.Created
      FROM ProjectMeeting pm
      JOIN ProjectGroup pg ON pg.ProjectGroupID = pm.ProjectGroupID
      JOIN Staff s ON s.StaffID = pm.GuideStaffID
    `

    const params: any[] = []

    if (groupId) {
      query += " WHERE pm.ProjectGroupID = ?"
      params.push(groupId)
    }

    query += " ORDER BY pm.MeetingDateTime DESC"

    const [rows] = await db.query(query, params)
    return NextResponse.json(rows)
  } catch (error) {
    console.error("ProjectMeeting GET error:", error)
    return NextResponse.json(
      { error: "Failed to fetch project meetings" },
      { status: 500 }
    )
  }
}

/* =====================================
   POST: Create new meeting
===================================== */
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
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
    } = body

    const [result]: any = await db.query(
      `
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
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
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
      ]
    )

    return NextResponse.json({
      message: "Project meeting created successfully",
      ProjectMeetingID: result.insertId
    })
  } catch (error) {
    console.error("ProjectMeeting POST error:", error)
    return NextResponse.json(
      { error: "Failed to create project meeting" },
      { status: 500 }
    )
  }
}
