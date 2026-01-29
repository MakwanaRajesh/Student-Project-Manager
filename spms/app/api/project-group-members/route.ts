import { db } from "@/lib/db"
import { NextResponse } from "next/server"

/* =====================================
   GET: All members OR by ProjectGroupID
===================================== */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const groupId = searchParams.get("groupId")

    let query = `
      SELECT
        pgm.ProjectGroupMemberID,
        pgm.ProjectGroupID,
        pg.ProjectGroupName,
        pgm.StudentID,
        s.StudentName,
        pgm.IsGroupLeader,
        pgm.StudentCGPA,
        pgm.Description,
        pgm.Created
      FROM ProjectGroupMember pgm
      JOIN Student s ON s.StudentID = pgm.StudentID
      JOIN ProjectGroup pg ON pg.ProjectGroupID = pgm.ProjectGroupID
    `

    const params: any[] = []

    if (groupId) {
      query += " WHERE pgm.ProjectGroupID = ?"
      params.push(groupId)
    }

    const [rows] = await db.query(query, params)
    return NextResponse.json(rows)
  } catch (error) {
    console.error("ProjectGroupMember GET error:", error)
    return NextResponse.json({ error: "Failed to fetch group members" }, { status: 500 })
  }
}

/* =====================================
   POST: Add student to group
===================================== */
export async function POST(request: Request) {
  try {
    const {
      ProjectGroupID,
      StudentID,
      IsGroupLeader,
      StudentCGPA,
      Description
    } = await request.json()

    const [result]: any = await db.query(
      `
      INSERT INTO ProjectGroupMember
      (ProjectGroupID, StudentID, IsGroupLeader, StudentCGPA, Description)
      VALUES (?, ?, ?, ?, ?)
      `,
      [ProjectGroupID, StudentID, IsGroupLeader, StudentCGPA, Description]
    )

    return NextResponse.json({
      message: "Student added successfully",
      ProjectGroupMemberID: result.insertId
    })
  } catch (error) {
    console.error("POST ProjectGroupMember error:", error)
    return NextResponse.json(
      { message: "Failed to add group member" },
      { status: 500 }
    )
  }
}