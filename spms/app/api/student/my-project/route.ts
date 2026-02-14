import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: Request) {
  const email = request.headers.get("x-user-email") // or session

  if (!email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const [rows]: any = await db.query(`
    SELECT
      pg.ProjectGroupID,
      pg.ProjectGroupName,
      pg.ProjectTitle,
      pg.ProjectArea,
      pg.Status,
      guide.StaffName AS GuideStaffName
    FROM ProjectGroup pg
    JOIN ProjectGroupMember pgm ON pgm.ProjectGroupID = pg.ProjectGroupID
    JOIN Student s ON s.StudentID = pgm.StudentID
    LEFT JOIN Staff guide ON guide.StaffID = pg.GuideStaffID
    WHERE s.Email = ?
  `, [email])

  return NextResponse.json(rows)
}
