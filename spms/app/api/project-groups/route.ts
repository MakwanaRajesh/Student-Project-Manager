import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import type { RowDataPacket, ResultSetHeader } from "mysql2"

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
  status: string
  Description: string | null
}

/* ================= GET ALL ================= */
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
        pg.Status AS status,
        COUNT(pgm.ProjectGroupMemberID) AS MembersCount
      FROM ProjectGroup pg
      JOIN ProjectType pt ON pt.ProjectTypeID = pg.ProjectTypeID
      LEFT JOIN Staff s ON s.StaffID = pg.GuideStaffID
      LEFT JOIN ProjectGroupMember pgm ON pgm.ProjectGroupID = pg.ProjectGroupID
      GROUP BY pg.ProjectGroupID
      ORDER BY pg.Created DESC
    `)

    return NextResponse.json(
      rows.map(g => ({
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
        status: g.status
      }))
    )
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: "Failed" }, { status: 500 })
  }
}

/* ================= POST ================= */
export async function POST(request: Request) {
  try {
    const body = await request.json()

    const [result] = await db.query<ResultSetHeader>(
      `
      INSERT INTO ProjectGroup
      (
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
        Status
      )
      VALUES (?,?,?,?,?,?,?,?,?,?,?)
      `,
      [
        body.ProjectGroupName,
        body.ProjectTypeID,
        body.GuideStaffID,
        body.ProjectTitle,
        body.ProjectArea,
        body.ProjectDescription,
        body.AverageCPI,
        body.ConvenerStaffID,
        body.ExpertStaffID,
        body.Description,
        body.Status ?? "pending"
      ]
    )

    return NextResponse.json(
      { ProjectGroupID: result.insertId },
      { status: 201 }
    )
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: "Failed" }, { status: 500 })
  }
}