// import { db } from "@/lib/db";
// import { NextResponse } from "next/server";

// export async function GET() {
//   const [rows] = await db.query("SELECT * FROM ProjectMeeting");
//   return NextResponse.json(rows);
// }

// export async function POST(req: Request) {
//   const body = await req.json();

//   await db.query(
//     `INSERT INTO ProjectMeeting
//      (ProjectGroupID, GuideStaffID, MeetingDateTime, MeetingPurpose, MeetingLocation)
//      VALUES (?,?,?,?,?)`,
//     [
//       body.ProjectGroupID,
//       body.GuideStaffID,
//       body.MeetingDateTime,
//       body.MeetingPurpose,
//       body.MeetingLocation,
//     ]
//   );

//   return NextResponse.json({ message: "Meeting Scheduled" });
// }



import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const [data] = await db.query(`
      SELECT
        pm.ProjectMeetingID,
        pm.ProjectGroupID,
        s.StaffName AS GuideStaffName,
        pm.MeetingDateTime,
        pm.MeetingPurpose,
        pm.MeetingLocation,
        pm.MeetingNotes,
        pm.MeetingStatus,
        pm.MeetingStatusDescription,
        pm.MeetingStatusDatetime,
        pm.Description
      FROM ProjectMeeting pm
      JOIN Staff s ON s.StaffID = pm.GuideStaffID
      ORDER BY pm.MeetingDateTime DESC
    `);

    return NextResponse.json(data);
  } catch (error) {
    console.error("ProjectMeeting GET error", error);
    return NextResponse.json(
      { error: "Failed to fetch Project Meeting" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
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
    } = await req.json();

    if (!ProjectGroupID || !GuideStaffID || !MeetingDateTime) {
      return NextResponse.json(
        { error: "Required fields missing" },
        { status: 400 }
      );
    }

    await db.query(
      `INSERT INTO ProjectMeeting
      (ProjectGroupID, GuideStaffID, MeetingDateTime, MeetingPurpose, MeetingLocation,
       MeetingNotes, MeetingStatus, MeetingStatusDescription, MeetingStatusDatetime, Description)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
    );

    return NextResponse.json(
      { message: "New Project Meeting is Created" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Project Meeting POST error", error);
    return NextResponse.json(
      { error: "Failed to create Project Meeting" },
      { status: 500 }
    );
  }
}


export function PUT() {
  return NextResponse.json({ message: "PUT is Working..." })
}

export function DELETE() {
  return NextResponse.json({ message: "DELETE is Working..." })
}

export function PATCH() {
  return NextResponse.json({ message: "PATCH is Working..." })
}