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
  ProjectDescription: string | null
  GuideStaffName: string | null
  ConvenerStaffName: string | null
  ExpertStaffName: string | null
  AverageCPI: number | null
  Created: Date
  Modified: Date
}

/* ---------------- GET BY ID ---------------- */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const groupId = Number(params.id)

  if (isNaN(groupId)) {
    return NextResponse.json(
      { message: "Invalid project group ID" },
      { status: 400 }
    )
  }

  try {
    const [rows] = await db.query<ProjectGroupRow[]>(
      `
      SELECT 
        pg.ProjectGroupID,
        pg.ProjectGroupName,
        pg.ProjectTitle,
        pg.ProjectArea,
        pg.ProjectTypeID,
        pt.ProjectTypeName,
        pg.ProjectDescription,
        pg.AverageCPI,
        gs.StaffName AS GuideStaffName,
        cs.StaffName AS ConvenerStaffName,
        es.StaffName AS ExpertStaffName,
        pg.Created,
        pg.Modified
      FROM ProjectGroup pg
      LEFT JOIN ProjectType pt ON pt.ProjectTypeID = pg.ProjectTypeID
      LEFT JOIN Staff gs ON gs.StaffID = pg.GuideStaffID
      LEFT JOIN Staff cs ON cs.StaffID = pg.ConvenerStaffID
      LEFT JOIN Staff es ON es.StaffID = pg.ExpertStaffID
      WHERE pg.ProjectGroupID = ?
      `,
      [groupId]
    )

    if (rows.length === 0) {
      return NextResponse.json(
        { message: "Project group not found" },
        { status: 404 }
      )
    }

    const g = rows[0]

    return NextResponse.json({
      id: g.ProjectGroupID,
      name: g.ProjectGroupName,
      projectTitle: g.ProjectTitle,
      projectArea: g.ProjectArea,
      projectTypeId: g.ProjectTypeID,
      projectTypeName: g.ProjectTypeName,
      projectDescription: g.ProjectDescription,
      guideStaffName: g.GuideStaffName ?? "Not Assigned",
      convenerStaffName: g.ConvenerStaffName ?? "Not Assigned",
      expertStaffName: g.ExpertStaffName ?? "Not Assigned",
      averageCpi: g.AverageCPI ?? 0,
      created: g.Created,
      modified: g.Modified,
    })
  } catch (error) {
    console.error("GET ProjectGroup by ID error:", error)
    return NextResponse.json(
      { message: "Failed to fetch project group" },
      { status: 500 }
    )
  }
}

/* ---------------- PUT ---------------- */
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const groupId = Number(params.id)

  if (isNaN(groupId)) {
    return NextResponse.json(
      { message: "Invalid project group ID" },
      { status: 400 }
    )
  }

  try {
    const body = await request.json()

    const [result] = await db.query<ResultSetHeader>(
      `
      UPDATE ProjectGroup SET
        ProjectGroupName = ?,
        ProjectTypeID = ?,
        GuideStaffID = ?,
        ProjectTitle = ?,
        ProjectArea = ?,
        ProjectDescription = ?,
        AverageCPI = ?,
        ConvenerStaffID = ?,
        ExpertStaffID = ?,
        Description = ?
      WHERE ProjectGroupID = ?
      `,
      [
        body.ProjectGroupName,
        body.ProjectTypeID,
        body.GuideStaffID ?? null,
        body.ProjectTitle ?? null,
        body.ProjectArea ?? null,
        body.ProjectDescription ?? null,
        body.AverageCPI ?? null,
        body.ConvenerStaffID ?? null,
        body.ExpertStaffID ?? null,
        body.Description ?? null,
        groupId,
      ]
    )

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: "Project group not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: "Project group updated" })
  } catch (error) {
    console.error("PUT ProjectGroup error:", error)
    return NextResponse.json(
      { message: "Failed to update project group" },
      { status: 500 }
    )
  }
}

/* ---------------- DELETE ---------------- */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const groupId = Number(params.id)

  if (isNaN(groupId)) {
    return NextResponse.json(
      { message: "Invalid project group ID" },
      { status: 400 }
    )
  }

  try {
    const [result] = await db.query<ResultSetHeader>(
      `DELETE FROM ProjectGroup WHERE ProjectGroupID = ?`,
      [groupId]
    )

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: "Project group not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: "Project group deleted" })
  } catch (error) {
    console.error("DELETE ProjectGroup error:", error)
    return NextResponse.json(
      { message: "Failed to delete project group" },
      { status: 500 }
    )
  }
}
