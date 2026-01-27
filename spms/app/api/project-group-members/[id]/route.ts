import { db } from "@/lib/db"
import { NextResponse } from "next/server"

/* =====================================
   GET: Get single ProjectGroupMember by ID
===================================== */
// export async function GET(
//   req: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const [rows]: any = await db.query(
//       `
//       SELECT
//         pgm.ProjectGroupMemberID,
//         pgm.ProjectGroupID,
//         pg.ProjectGroupName,
//         pgm.StudentID,
//         s.StudentName,
//         pgm.IsGroupLeader,
//         pgm.StudentCGPA,
//         pgm.Description,
//         pgm.Created,
//         pgm.Modified
//       FROM ProjectGroupMember pgm
//       JOIN Student s ON s.StudentID = pgm.StudentID
//       JOIN ProjectGroup pg ON pg.ProjectGroupID = pgm.ProjectGroupID
//       WHERE pgm.ProjectGroupMemberID = ?
//       `,
//       [params.id]
//     )

//     if (rows.length === 0) {
//       return NextResponse.json(
//         { error: "Project group member not found" },
//         { status: 404 }
//       )
//     }

//     return NextResponse.json(rows[0])
//   } catch (error) {
//     console.error("ProjectGroupMember GET by ID error:", error)
//     return NextResponse.json(
//       { error: "Failed to fetch project group member" },
//       { status: 500 }
//     )
//   }
// }

export async function GET(request: Request) {
    try {
        // Parse the ID from the URL
        const url = new URL(request.url);
        const pathSegments = url.pathname.split('/');
        const ProjectGroupMemberID = pathSegments[pathSegments.length - 1];

        console.log("Extracted ProjectGroupMember ID:", ProjectGroupMemberID);

        if (!ProjectGroupMemberID || isNaN(parseInt(ProjectGroupMemberID))) {
            return NextResponse.json(
                { message: "Valid ProjectGroupMember ID is required" },
                { status: 400 }
            );
        }

        const [rows] = await db.query(
            `
      SELECT
        pgm.ProjectGroupMemberID,
        pgm.ProjectGroupID,
        pg.ProjectGroupName,
        pgm.StudentID,
        s.StudentName,
        pgm.IsGroupLeader,
        pgm.StudentCGPA,
        pgm.Description,
        pgm.Created,
        pgm.Modified
      FROM ProjectGroupMember pgm
      JOIN Student s ON s.StudentID = pgm.StudentID
      JOIN ProjectGroup pg ON pg.ProjectGroupID = pgm.ProjectGroupID
      WHERE pgm.ProjectGroupMemberID = ?`,
            [parseInt(ProjectGroupMemberID)]
        );

        const ProjectGroupMemberArray = rows as any[];

        if (!ProjectGroupMemberArray.length) {
            return NextResponse.json(
                { message: "ProjectGroupMember not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(ProjectGroupMemberArray[0]);
    } catch (error) {
        console.error("Error fetching ProjectGroupMember:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}

/* =====================================
   PUT: Update group member
===================================== */
export async function PUT(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const body = await req.json()
        const { IsGroupLeader, StudentCGPA, Description } = body

        await db.query(
            `
      UPDATE ProjectGroupMember
      SET IsGroupLeader = ?, StudentCGPA = ?, Description = ?
      WHERE ProjectGroupMemberID = ?
      `,
            [IsGroupLeader, StudentCGPA, Description, params.id]
        )

        return NextResponse.json({
            message: "Project group member updated successfully"
        })
    } catch (error) {
        console.error("ProjectGroupMember PUT error:", error)
        return NextResponse.json(
            { error: "Failed to update project group member" },
            { status: 500 }
        )
    }
}

/* =====================================
   DELETE: Remove student from group
===================================== */
export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        await db.query(
            "DELETE FROM ProjectGroupMember WHERE ProjectGroupMemberID = ?",
            [params.id]
        )

        return NextResponse.json({
            message: "Project group member deleted successfully"
        })
    } catch (error) {
        console.error("ProjectGroupMember DELETE error:", error)
        return NextResponse.json(
            { error: "Failed to delete project group member" },
            { status: 500 }
        )
    }
}
