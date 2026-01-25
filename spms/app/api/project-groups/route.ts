import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import type { RowDataPacket } from "mysql2"

interface ProjectGroupRow extends RowDataPacket {
  ProjectGroupID: number
  ProjectGroupName: string
  ProjectTitle: string
  ProjectArea: string
  ProjectTypeID: number
  ProjectTypeName: string
  GuideStaffName: string | null
  AverageCPI: number | null
  MembersCount: number
}

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
        COUNT(pgm.ProjectGroupMemberID) AS MembersCount
      FROM ProjectGroup pg
      JOIN ProjectType pt ON pt.ProjectTypeID = pg.ProjectTypeID
      LEFT JOIN Staff s ON s.StaffID = pg.GuideStaffID
      LEFT JOIN ProjectGroupMember pgm ON pgm.ProjectGroupID = pg.ProjectGroupID
      GROUP BY pg.ProjectGroupID
      ORDER BY pg.Created DESC
    `)

    const data = rows.map((group) => ({
      id: group.ProjectGroupID,
      name: group.ProjectGroupName,
      projectTitle: group.ProjectTitle,
      projectArea: group.ProjectArea,
      projectTypeId: group.ProjectTypeID,
      projectTypeName: group.ProjectTypeName,
      guideStaffName: group.GuideStaffName ?? "Not Assigned",
      averageCpi: group.AverageCPI ?? 0,
      membersCount: group.MembersCount,
      status: "approved",
    }))

    return NextResponse.json(data)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: "Failed to fetch project groups" },
      { status: 500 }
    )
  }
}
