import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import type { RowDataPacket, ResultSetHeader } from "mysql2"

// =======================
// GET: All Project Groups
// =======================
export async function GET() {
  try {
    const [rows] = await db.query<RowDataPacket[]>(`
      SELECT 
        pg.*,
        pt.ProjectTypeName,
        g.StaffName AS GuideName,
        c.StaffName AS ConvenerName,
        e.StaffName AS ExpertName
      FROM ProjectGroup pg
      LEFT JOIN ProjectType pt ON pg.ProjectTypeID = pt.ProjectTypeID
      LEFT JOIN Staff g ON pg.GuideStaffID = g.StaffID
      LEFT JOIN Staff c ON pg.ConvenerStaffID = c.StaffID
      LEFT JOIN Staff e ON pg.ExpertStaffID = e.StaffID
      ORDER BY pg.Created DESC
    `)

    return NextResponse.json(rows)
  } catch (error) {
    console.error("GET ProjectGroup Error:", error)
    return NextResponse.json(
      { message: "Failed to fetch project groups" },
      { status: 500 }
    )
  }
}

// =======================
// POST: Create Project Group
// =======================
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
      Status
    } = body

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
        Status ?? "pending"
      ]
    )

    return NextResponse.json(
      { message: "Project group created", ProjectGroupID: result.insertId },
      { status: 201 }
    )
  } catch (error) {
    console.error("POST ProjectGroup Error:", error)
    return NextResponse.json(
      { message: "Failed to create project group" },
      { status: 500 }
    )
  }
}
