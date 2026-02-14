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
  // status: string
  Status: "pending" | "approved" | "rejected"
  Description: string | null
}

/* ================= GET ALL ================= */
export async function GET() {
  try {
    const [rows] = await db.query<ProjectGroupRow[]>(
      `
      SELECT * FROM ProjectGroup
    `)

    return NextResponse.json(rows)
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
      { id: result.insertId, message: "Project Group Created Successfully" },
      { status: 201 }
    )

  } catch (error: any) {
    console.error("Project Group POST Error", error)

    return NextResponse.json(
      { message: "Failed", error: error.message }, { status: 500 }
    )
  }
}