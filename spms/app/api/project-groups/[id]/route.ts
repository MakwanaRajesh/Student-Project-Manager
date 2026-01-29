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

export async function GET(request: Request) {
  try {
    // Parse the ID from the URL
    const url = new URL(request.url);
    const pathSegments = url.pathname.split('/');
    const ProjectGroupID = pathSegments[pathSegments.length - 1];

    console.log("Extracted ProjectGroup ID:", ProjectGroupID);

    if (!ProjectGroupID || isNaN(parseInt(ProjectGroupID))) {
      return NextResponse.json(
        { message: "Valid ProjectGroup ID is required" },
        { status: 400 }
      );
    }

    const [rows] = await db.query(
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
      WHERE pg.ProjectGroupID = ?`,
      [parseInt(ProjectGroupID)]
    );

    const ProjectGroupArray = rows as any[];

    if (!ProjectGroupArray.length) {
      return NextResponse.json(
        { message: "ProjectGroup not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(ProjectGroupArray[0]);
  } catch (error) {
    console.error("Error fetching ProjectGroup:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

/* ---------------- PUT ---------------- */

export async function PUT(request: Request) {
  try {
    const url = new URL(request.url)
    const pathSegments = url.pathname.split("/")
    const ProjectGroupID = pathSegments[pathSegments.length - 1]

    if (!ProjectGroupID || isNaN(Number(ProjectGroupID))) {
      return NextResponse.json(
        { message: "Valid ProjectGroup ID is required" },
        { status: 400 }
      )
    }

    const body = await request.json()

    const {
      ProjectGroupName,
      ProjectTitle,
      ProjectArea,
      ProjectTypeID,
      ProjectDescription,
      AverageCPI,
      GuideStaffID,
      ConvenerStaffID,
      ExpertStaffID,
    } = body

    const [result]: any = await db.query(
      `
      UPDATE ProjectGroup SET
        ProjectGroupName = ?,
        ProjectTitle = ?,
        ProjectArea = ?,
        ProjectTypeID = ?,
        ProjectDescription = ?,
        AverageCPI = ?,
        GuideStaffID = ?,
        ConvenerStaffID = ?,
        ExpertStaffID = ?,
        Modified = NOW()
      WHERE ProjectGroupID = ?
      `,
      [
        ProjectGroupName,
        ProjectTitle,
        ProjectArea,
        ProjectTypeID,
        ProjectDescription,
        AverageCPI,
        GuideStaffID,
        ConvenerStaffID,
        ExpertStaffID,
        ProjectGroupID,
      ]
    )

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: "ProjectGroup not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: "ProjectGroup updated successfully" })
  } catch (error) {
    console.error("Error updating ProjectGroup:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}


/* ---------------- DELETE ---------------- */
export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url)
    const pathSegments = url.pathname.split("/")
    const ProjectGroupID = pathSegments[pathSegments.length - 1]

    if (!ProjectGroupID || isNaN(Number(ProjectGroupID))) {
      return NextResponse.json(
        { message: "Valid ProjectGroup ID is required" },
        { status: 400 }
      )
    }

    const [result]: any = await db.query(
      `DELETE FROM ProjectGroup WHERE ProjectGroupID = ?`,
      [ProjectGroupID]
    )

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: "ProjectGroup not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: "ProjectGroup deleted successfully" })
  } catch (error) {
    console.error("Error deleting ProjectGroup:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
