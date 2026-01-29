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
export async function POST(request: Request) {
  try {
    const body = await request.json()

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

    // 🔒 BASIC VALIDATION
    if (!ProjectGroupID || !GuideStaffID || !MeetingDateTime) {
      return NextResponse.json(
        { message: "ProjectGroupID, GuideStaffID and MeetingDateTime are required" },
        { status: 400 }
      )
    }

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
        Number(ProjectGroupID),
        Number(GuideStaffID),
        new Date(MeetingDateTime),
        MeetingPurpose ?? null,
        MeetingLocation ?? null,
        MeetingNotes ?? null,
        MeetingStatus ?? null,
        MeetingStatusDescription ?? null,
        MeetingStatusDatetime ? new Date(MeetingStatusDatetime) : null,
        Description ?? null
      ]
    )

    return NextResponse.json({
      message: "Project meeting created successfully",
      ProjectMeetingID: result.insertId
    }, { status: 201 })

  } catch (error) {
    console.error("❌ ProjectMeeting POST error:", error)
    return NextResponse.json(
      { message: "Failed to create project meeting" },
      { status: 500 }
    )
  }
}

