import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const [rows]: any = await db.query(`
      SELECT 
        pg.ProjectGroupID,
        pg.ProjectGroupName,
        pg.ProjectTitle,
        pg.ProjectArea,
        pt.ProjectTypeName,
        s.StaffName AS GuideStaffName,
        pg.AverageCPI,
        COUNT(pgm.ProjectGroupMemberID) AS MembersCount
      FROM ProjectGroup pg
      JOIN ProjectType pt ON pt.ProjectTypeID = pg.ProjectTypeID
      LEFT JOIN Staff s ON s.StaffID = pg.GuideStaffID
      LEFT JOIN ProjectGroupMember pgm ON pgm.ProjectGroupID = pg.ProjectGroupID
      WHERE pg.ProjectGroupID = ?
      GROUP BY pg.ProjectGroupID
    `, [params.id])

    if (!rows.length) {
      return NextResponse.json(
        { message: "Not found" },
        { status: 404 }
      )
    }

    const group = rows[0]

    return NextResponse.json({
      id: group.ProjectGroupID,
      name: group.ProjectGroupName,
      projectTitle: group.ProjectTitle,
      projectArea: group.ProjectArea,
      projectTypeName: group.ProjectTypeName,
      guideStaffName: group.GuideStaffName ?? "Not Assigned",
      averageCpi: group.AverageCPI ?? 0,
      membersCount: group.MembersCount,
      status: "approved",
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: "Failed to fetch project group" },
      { status: 500 }
    )
  }
}
