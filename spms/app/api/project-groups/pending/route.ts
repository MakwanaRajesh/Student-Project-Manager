import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import type { RowDataPacket } from "mysql2"

interface PendingGroupRow extends RowDataPacket {
  ProjectGroupID: number
  ProjectGroupName: string
  ProjectTitle: string
  ProjectArea: string
  ProjectDescription: string
  AverageCPI: string | null
  GuideStaffName: string | null
  ProjectTypeName: string
  MembersCount: string
}

export async function GET() {
  try {
    const [rows] = await db.query<PendingGroupRow[]>(`
      SELECT 
        pg.ProjectGroupID,
        pg.ProjectGroupName,
        pg.ProjectTitle,
        pg.ProjectArea,
        pg.ProjectDescription,
        pg.AverageCPI,
        s.StaffName AS GuideStaffName,
        pt.ProjectTypeName,
        COUNT(pgm.ProjectGroupMemberID) AS MembersCount
      FROM ProjectGroup pg
      JOIN ProjectType pt ON pt.ProjectTypeID = pg.ProjectTypeID
      LEFT JOIN Staff s ON s.StaffID = pg.GuideStaffID
      LEFT JOIN ProjectGroupMember pgm ON pgm.ProjectGroupID = pg.ProjectGroupID
      WHERE pg.Description = 'Pending'
      GROUP BY pg.ProjectGroupID
      ORDER BY pg.Created DESC
    `)

    const data = rows.map((g) => ({
      id: g.ProjectGroupID,
      name: g.ProjectGroupName,
      projectTitle: g.ProjectTitle,
      projectArea: g.ProjectArea,
      projectDescription: g.ProjectDescription,
      guideStaffName: g.GuideStaffName ?? "Not Assigned",
      projectTypeName: g.ProjectTypeName,
      averageCpi: g.AverageCPI ? Number(g.AverageCPI) : 0,
      membersCount: Number(g.MembersCount),
      status: "pending",
    }))

    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json({ message: "Failed to load pending projects" }, { status: 500 })
  }
}
