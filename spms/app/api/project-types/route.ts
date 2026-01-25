// import { db } from "@/lib/db";
// import { NextResponse } from "next/server";

// // GET ALL
// export async function GET() {
//   const [rows] = await db.query("SELECT * FROM ProjectType");
//   return NextResponse.json(rows);
// }

// // CREATE
// export async function POST(req: Request) {
//   const body = await req.json();
//   const { ProjectTypeName, Description } = body;

//   await db.query(
//     "INSERT INTO ProjectType (ProjectTypeName, Description) VALUES (?, ?)",
//     [ProjectTypeName, Description]
//   );

//   return NextResponse.json({ message: "Project Type Created" });
// }
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

/* ===================== GET ALL ===================== */
export async function GET() {
  const [rows]: any = await db.query(
    "SELECT ProjectTypeID AS id, ProjectTypeName AS name, Description AS description FROM ProjectType"
  );
  return NextResponse.json(rows);
}

/* ===================== CREATE ===================== */
export async function POST(req: Request) {
  try {
    const { name, description } = await req.json();

    if (!name || name.trim().length < 2) {
      return NextResponse.json(
        { message: "Project type name is required" },
        { status: 400 }
      );
    }

    const [result]: any = await db.query(
      "INSERT INTO ProjectType (ProjectTypeName, Description) VALUES (?, ?)",
      [name.trim(), description || null]
    );

    return NextResponse.json(
      {
        message: "Project type created",
        id: result.insertId,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
