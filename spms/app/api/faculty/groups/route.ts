import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const facultyEmail = req.headers.get("x-user-email");

    if (!facultyEmail) {
      return NextResponse.json(
        { error: "Faculty email missing" },
        { status: 400 }
      );
    }

    // 1️⃣ Find faculty
    const [[faculty]]: any = await db.query(
      "SELECT StaffID FROM Staff WHERE Email = ?",
      [facultyEmail]
    );

    if (!faculty) {
      return NextResponse.json(
        { error: "Faculty not found" },
        { status: 404 }
      );
    }

    // 2️⃣ Fetch guided groups
    const [groups]: any = await db.query(
      `
      SELECT
        pg.ProjectGroupID,
        pg.ProjectGroupName,
        pg.ProjectTitle,
        pg.ProjectArea,
        pg.ProjectDescription,
        pg.AverageCPI,
        pg.Status,
        pt.ProjectTypeName,
        COUNT(pgm.ProjectGroupMemberID) AS MembersCount
      FROM ProjectGroup pg
      JOIN ProjectType pt ON pt.ProjectTypeID = pg.ProjectTypeID
      LEFT JOIN ProjectGroupMember pgm
        ON pgm.ProjectGroupID = pg.ProjectGroupID
      WHERE pg.GuideStaffID = ?
      GROUP BY pg.ProjectGroupID
      `,
      [faculty.StaffID]
    );

    return NextResponse.json(groups);

  } catch (error) {
    console.error("Faculty groups API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch faculty groups" },
      { status: 500 }
    );
  }
}
