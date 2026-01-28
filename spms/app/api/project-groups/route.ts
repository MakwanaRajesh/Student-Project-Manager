// import { NextResponse } from "next/server"
// import { db } from "@/lib/db"
// import type { RowDataPacket } from "mysql2"

// interface ProjectGroupRow extends RowDataPacket {
//   ProjectGroupID: number
//   ProjectGroupName: string
//   ProjectTitle: string
//   ProjectArea: string
//   ProjectTypeID: number
//   ProjectTypeName: string
//   GuideStaffName: string | null
//   AverageCPI: number | null
//   MembersCount: number
// }

// export async function GET() {
//   try {
//     const [rows] = await db.query<ProjectGroupRow[]>(`
//       SELECT 
//         pg.ProjectGroupID,
//         pg.ProjectGroupName,
//         pg.ProjectTitle,
//         pg.ProjectArea,
//         pg.ProjectTypeID,
//         pt.ProjectTypeName,
//         s.StaffName AS GuideStaffName,
//         pg.AverageCPI,
//         COUNT(pgm.ProjectGroupMemberID) AS MembersCount
//       FROM ProjectGroup pg
//       JOIN ProjectType pt ON pt.ProjectTypeID = pg.ProjectTypeID
//       LEFT JOIN Staff s ON s.StaffID = pg.GuideStaffID
//       LEFT JOIN ProjectGroupMember pgm ON pgm.ProjectGroupID = pg.ProjectGroupID
//       GROUP BY pg.ProjectGroupID
//       ORDER BY pg.Created DESC
//     `)

//     const data = rows.map((group) => ({
//       id: group.ProjectGroupID,
//       name: group.ProjectGroupName,
//       projectTitle: group.ProjectTitle,
//       projectArea: group.ProjectArea,
//       projectTypeId: group.ProjectTypeID,
//       projectTypeName: group.ProjectTypeName,
//       guideStaffName: group.GuideStaffName ?? "Not Assigned",
//       averageCpi: group.AverageCPI ?? 0,
//       membersCount: group.MembersCount,
//       status: "approved",
//     }))

//     return NextResponse.json(data)
//   } catch (error) {
//     console.error(error)
//     return NextResponse.json(
//       { message: "Failed to fetch project groups" },
//       { status: 500 }
//     )
//   }
// }




import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import type { RowDataPacket, ResultSetHeader } from "mysql2"

/* ---------------- TYPES ---------------- */
interface ProjectGroupRow extends RowDataPacket {
  ProjectGroupID: number
  ProjectGroupName: string
  ProjectTitle: string | null
  ProjectArea: string | null
  ProjectTypeID: number
  ProjectTypeName: string
  GuideStaffName: string | null
  AverageCPI: number | null
  MembersCount: number
}

/* ---------------- GET ALL ---------------- */
export async function GET() {
  try {
    const [rows] = await db.query<ProjectGroupRow[]>(`
      SELECT 
        pg.ProjectGroupID,
        pg.ProjectGroupName,
        pg.ProjectTitle,
        pg.ProjectArea,
        pg.ProjectTypeID,
        pt.ProjectTypeName,
        s.StaffName AS GuideStaffName,
        pg.AverageCPI,
        pg.Description,
        COUNT(pgm.ProjectGroupMemberID) AS MembersCount
      FROM ProjectGroup pg
      JOIN ProjectType pt ON pt.ProjectTypeID = pg.ProjectTypeID
      LEFT JOIN Staff s ON s.StaffID = pg.GuideStaffID
      LEFT JOIN ProjectGroupMember pgm ON pgm.ProjectGroupID = pg.ProjectGroupID
      GROUP BY pg.ProjectGroupID
      ORDER BY pg.Created DESC
    `)

    return NextResponse.json(
      rows.map((g) => ({
        id: g.ProjectGroupID,
        name: g.ProjectGroupName,
        projectTitle: g.ProjectTitle,
        projectArea: g.ProjectArea,
        projectTypeId: g.ProjectTypeID,
        projectTypeName: g.ProjectTypeName,
        guideStaffName: g.GuideStaffName ?? "Not Assigned",
        averageCpi: g.AverageCPI ?? 0,
        description: g.Description,
        membersCount: g.MembersCount,
        status: "approved",
      }))
    )
  } catch (error) {
    console.error("GET ProjectGroup error:", error)
    return NextResponse.json(
      { message: "Failed to fetch project groups" },
      { status: 500 }
    )
  }
}

/* ---------------- POST ---------------- */
export async function POST(request: Request) {
  try {
    const body = await request.json()

    const {
      ProjectGroupName,
      ProjectTypeID,
      GuideStaffID,
      ProjectTitle,
      ProjectArea,
      ProjectDescription,
      AverageCPI,
      ConvenerStaffID,
      ExpertStaffID,
      Description,
    } = body

    if (!ProjectGroupName || !ProjectTypeID) {
      return NextResponse.json(
        { message: "ProjectGroupName and ProjectTypeID are required" },
        { status: 400 }
      )
    }

    const [result] = await db.query<ResultSetHeader>(
      `
      INSERT INTO ProjectGroup (
        ProjectGroupName,
        ProjectTypeID,
        GuideStaffID,
        ProjectTitle,
        ProjectArea,
        ProjectDescription,
        AverageCPI,
        ConvenerStaffID,
        ExpertStaffID,
        Description
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        ProjectGroupName,
        ProjectTypeID,
        GuideStaffID ?? null,
        ProjectTitle ?? null,
        ProjectArea ?? null,
        ProjectDescription ?? null,
        AverageCPI ?? null,
        ConvenerStaffID ?? null,
        ExpertStaffID ?? null,
        Description ?? null,
      ]
    )

    return NextResponse.json(
      { message: "Project group created", id: result.insertId },
      { status: 201 }
    )
  } catch (error) {
    console.error("POST ProjectGroup error:", error)
    return NextResponse.json(
      { message: "Failed to create project group" },
      { status: 500 }
    )
  }
}
