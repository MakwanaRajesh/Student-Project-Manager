// import { db } from "@/lib/db";
// import { NextResponse } from "next/server";

// /* ===================== GET PROJECT TYPE BY ID ===================== */
// export async function GET(request: Request) {
//   try {
//     const url = new URL(request.url);
//     const pathSegments = url.pathname.split("/");
//     const projectTypeId = pathSegments[pathSegments.length - 1];

//     console.log("Extracted ProjectType ID:", projectTypeId);

//     if (!projectTypeId || isNaN(parseInt(projectTypeId))) {
//       return NextResponse.json(
//         { message: "Valid ProjectTypeID is required" },
//         { status: 400 }
//       );
//     }

//     const [rows]: any = await db.query(
//       "SELECT * FROM ProjectType WHERE ProjectTypeID = ?",
//       [parseInt(projectTypeId)]
//     );

//     if (!rows.length) {
//       return NextResponse.json(
//         { message: "Project type not found" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json({
//       id: rows[0].ProjectTypeID,
//       name: rows[0].ProjectTypeName,
//       description: rows[0].Description,
//       created: rows[0].CreatedAt,
//     });
//   } catch (error) {
//     console.error("Error fetching project type:", error);
//     return NextResponse.json(
//       { message: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

// /* ===================== UPDATE PROJECT TYPE ===================== */
// export async function PUT(request: Request) {
//   try {
//     const url = new URL(request.url);
//     const pathSegments = url.pathname.split("/");
//     const projectTypeId = pathSegments[pathSegments.length - 1];

//     if (!projectTypeId || isNaN(parseInt(projectTypeId))) {
//       return NextResponse.json(
//         { message: "Valid ProjectTypeID is required" },
//         { status: 400 }
//       );
//     }

//     const body = await request.json();
//     const name = body.name ?? body.ProjectTypeName;
//     const description = body.description ?? body.Description;

//     if (!name || name.trim().length < 2) {
//       return NextResponse.json(
//         { message: "Project type name is required" },
//         { status: 400 }
//       );
//     }

//     const [result]: any = await db.query(
//       "UPDATE ProjectType SET ProjectTypeName=?, Description=? WHERE ProjectTypeID=?",
//       [name.trim(), description || null, parseInt(projectTypeId)]
//     );

//     if (result.affectedRows === 0) {
//       return NextResponse.json(
//         { message: "Project type not found" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json({
//       message: "Project Type Updated successfully",
//       projectTypeId,
//     });
//   } catch (error: any) {
//     console.error("Error updating project type:", error);
//     return NextResponse.json(
//       { message: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

// /* ===================== DELETE PROJECT TYPE ===================== */
// export async function DELETE(request: Request) {
//   try {
//     const url = new URL(request.url);
//     const pathSegments = url.pathname.split("/");
//     const projectTypeId = pathSegments[pathSegments.length - 1];

//     if (!projectTypeId || isNaN(parseInt(projectTypeId))) {
//       return NextResponse.json(
//         { message: "Valid ProjectTypeID is required" },
//         { status: 400 }
//       );
//     }

//     const [rows]: any = await db.query(
//       "SELECT * FROM ProjectType WHERE ProjectTypeID = ?",
//       [parseInt(projectTypeId)]
//     );

//     if (!rows.length) {
//       return NextResponse.json(
//         { message: "Project type not found" },
//         { status: 404 }
//       );
//     }

//     await db.query(
//       "DELETE FROM ProjectType WHERE ProjectTypeID = ?",
//       [parseInt(projectTypeId)]
//     );

//     return NextResponse.json({
//       message: "Project Type Deleted successfully",
//       projectTypeId,
//     });
//   } catch (error) {
//     console.error("Error deleting project type:", error);
//     return NextResponse.json(
//       { message: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }



import { db } from "@/lib/db"
import { NextResponse } from "next/server"

/* ===================== GET BY ID ===================== */
export async function GET(
  _: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id)

  if (isNaN(id)) {
    return NextResponse.json(
      { message: "Valid ProjectTypeID is required" },
      { status: 400 }
    )
  }

  const [rows]: any = await db.query(
    "SELECT * FROM ProjectType WHERE ProjectTypeID = ?",
    [id]
  )

  if (!rows.length) {
    return NextResponse.json(
      { message: "Project type not found" },
      { status: 404 }
    )
  }

  const p = rows[0]

  return NextResponse.json({
    id: p.ProjectTypeID,
    name: p.ProjectTypeName,
    description: p.Description,
    created: p.Created,
  })
}

/* ===================== UPDATE ===================== */
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id)
  const { name, ProjectTypeName, description, Description } = await req.json()

  const finalName = name ?? ProjectTypeName
  const finalDesc = description ?? Description ?? null

  if (!finalName || finalName.trim().length < 2) {
    return NextResponse.json(
      { message: "Project type name is required" },
      { status: 400 }
    )
  }

  const [result]: any = await db.query(
    "UPDATE ProjectType SET ProjectTypeName=?, Description=? WHERE ProjectTypeID=?",
    [finalName.trim(), finalDesc, id]
  )

  if (result.affectedRows === 0) {
    return NextResponse.json(
      { message: "Project type not found" },
      { status: 404 }
    )
  }

  return NextResponse.json({ message: "Project type updated" })
}

/* ===================== DELETE ===================== */
// export async function DELETE(
//   _: Request,
//   { params }: { params: { id: string } }
// ) {
//   const id = Number(params.id)

//   const [result]: any = await db.query(
//     "DELETE FROM ProjectType WHERE ProjectTypeID = ?",
//     [id]
//   )

//   if (result.affectedRows === 0) {
//     return NextResponse.json(
//       { message: "Project type not found" },
//       { status: 404 }
//     )
//   }

//   return NextResponse.json({ message: "Project type deleted" })
// }


export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const pathSegments = url.pathname.split('/');
    const ProjectTypeID = pathSegments[pathSegments.length - 1];
    
    if (!ProjectTypeID || isNaN(parseInt(ProjectTypeID))) {
      return NextResponse.json(
        { message: "Valid Student ID is required" },
        { status: 400 }
      );
    }

    // First check if student exists
    const [rows] = await db.query(
      "SELECT * FROM ProjectType WHERE ProjectTypeID = ?",
      [parseInt(ProjectTypeID)]
    );

    const studentArray = rows as any[];

    if (!studentArray.length) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );
    }

    await db.query(
      "DELETE FROM ProjectType WHERE ProjectTypeID=?",
      [parseInt(ProjectTypeID)]
    );

    return NextResponse.json({ 
      message: "Project Deleted successfully",
      ProjectTypeID: ProjectTypeID
    });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}