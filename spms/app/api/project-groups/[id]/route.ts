import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import type { RowDataPacket, ResultSetHeader} from "mysql2"

interface ProjectGroupRow extends RowDataPacket {
  ProjectGroupID: number
  ProjectGroupName: string
  ProjectTypeID: number
  ProjectTypeName: string

  GuideStaffID: number | null
  ConvenerStaffID: number | null
  ExpertStaffID: number | null

  GuideStaffName: string | null
  ConvenerStaffName: string | null
  ExpertStaffName: string | null

  ProjectTitle: string | null
  ProjectArea: string | null
  ProjectDescription: string | null
  AverageCPI: string | number | null

  Status: string | "pending" | "approved" | "rejected"
  Created: Date
  Modified: Date
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const ProjectGroupID = url.pathname.split("/").pop()

    if (!ProjectGroupID || isNaN(Number(ProjectGroupID))) {
      return NextResponse.json(
        { message: "Valid ProjectGroup ID is required" },
        { status: 400 }
      )
    }

    const [rows] = await db.query<ProjectGroupRow[]>(
      `
      SELECT 
        pg.ProjectGroupID,
        pg.ProjectGroupName,
        pg.ProjectTypeID,
        pt.ProjectTypeName,

        pg.GuideStaffID,
        pg.ConvenerStaffID,
        pg.ExpertStaffID,

        gs.StaffName AS GuideStaffName,
        cs.StaffName AS ConvenerStaffName,
        es.StaffName AS ExpertStaffName,

        pg.ProjectTitle,
        pg.ProjectArea,
        pg.ProjectDescription,
        pg.AverageCPI,
        pg.Status,
        pg.Created,
        pg.Modified
      FROM ProjectGroup pg
      LEFT JOIN ProjectType pt ON pt.ProjectTypeID = pg.ProjectTypeID
      LEFT JOIN Staff gs ON gs.StaffID = pg.GuideStaffID
      LEFT JOIN Staff cs ON cs.StaffID = pg.ConvenerStaffID
      LEFT JOIN Staff es ON es.StaffID = pg.ExpertStaffID
      WHERE pg.ProjectGroupID = ?
      `,
      [Number(ProjectGroupID)]
    )

    if (!rows.length) {
      return NextResponse.json(
        { message: "ProjectGroup not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(rows[0])
  } catch (error) {
    console.error("Error fetching ProjectGroup:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}



/* ---------------- PUT ---------------- */


export async function PUT(request: Request) {
  try {
    const url = new URL(request.url)
    const ProjectGroupID = url.pathname.split("/").pop()

    if (!ProjectGroupID || isNaN(Number(ProjectGroupID))) {
      return NextResponse.json(
        { message: "Valid ProjectGroup ID is required" },
        { status: 400 }
      )
    }

    const projectGroupIdNum = Number(ProjectGroupID)
    const { Status } = await request.json()

    if (!Status) {
      return NextResponse.json(
        { message: "Status is required" },
        { status: 400 }
      )
    }

    if (!["pending", "approved", "rejected"].includes(Status)) {
      return NextResponse.json(
        { message: "Invalid status value" },
        { status: 400 }
      )
    }

    const [result] = await db.query<ResultSetHeader>(
      `
      UPDATE ProjectGroup
      SET Status = ?, Modified = NOW()
      WHERE ProjectGroupID = ?
      `,
      [Status, projectGroupIdNum]
    )

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: "ProjectGroup not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      message: `Project status updated to '${Status}'`
    })
  } catch (error) {
    console.error("Update Project Status error:", error)
    return NextResponse.json(
      { message: "Failed to update project status" },
      { status: 500 }
    )
  }
}





/* ---------------- DELETE ---------------- */
export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url)
    const ProjectGroupID = url.pathname.split("/").pop()

    if (!ProjectGroupID || isNaN(Number(ProjectGroupID))) {
      return NextResponse.json(
        { message: "Valid ProjectGroup ID is required" },
        { status: 400 }
      )
    }

    const projectGroupIdNum = Number(ProjectGroupID)

    const [result] = await db.query<ResultSetHeader>(
      `DELETE FROM ProjectGroup WHERE ProjectGroupID = ?`,
      [projectGroupIdNum]
    )

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: "ProjectGroup not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      message: "ProjectGroup deleted successfully"
    })
  } catch (error) {
    console.error("Error deleting ProjectGroup:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
