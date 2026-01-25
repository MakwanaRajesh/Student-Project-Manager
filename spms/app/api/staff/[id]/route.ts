// import { NextResponse } from "next/server";
// import { db } from "@/lib/db";

// export async function GET(
//   req: Request,
//   { params }: { params: { id: string } }
// ) {
//   const result = await db.query(
//     "SELECT * FROM Staff WHERE StaffID=?",
//     [params.id]
//   );

//   const rows = result[0] as any[];

//   if (!rows.length) {
//     return NextResponse.json(
//       { message: "Staff not found" },
//       { status: 404 }
//     );
//   }

//   return NextResponse.json(rows[0]);

// }

// export async function PUT(
//   req: Request,
//   { params }: { params: { id: string } }
// ) {
//   const { StaffName, Phone, Email, Description } = await req.json();

//   await db.query(
//     "UPDATE Staff SET StaffName=?, Phone=?, Email=?, Description=? WHERE StaffID=?",
//     [StaffName, Phone, Email, Description, params.id]
//   );

//   return NextResponse.json({ message: "staff Updated" });
// }

// export async function DELETE(
//   req: Request,
//   { params }: { params: { id: string } }
// ) {
//   await db.query(
//     "DELETE FROM Staff WHERE StaffID=?",
//     [params.id]
//   );

//   return NextResponse.json({ message: "staff Deleted" });
// }

import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const pathSegments = url.pathname.split("/");
    const staffId = pathSegments[pathSegments.length - 1];

    console.log("Extracted Staff ID:", staffId);

    if (!staffId || isNaN(parseInt(staffId))) {
      return NextResponse.json(
        { message: "Valid Staff ID is required" },
        { status: 400 }
      );
    }

    const [rows] = await db.query(
      "SELECT * FROM Staff WHERE staffId = ?",
      [parseInt(staffId)]
    );

    const staffArray = rows as any[];

    if (!staffArray.length) {
      return NextResponse.json(
        { message: "Staff not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(staffArray[0]);
  } catch (error) {
    console.error("Error fetching staff:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
export async function PUT(request: Request) {
  try {
    const url = new URL(request.url);
    const pathSegments = url.pathname.split("/");
    const staffId = pathSegments[pathSegments.length - 1];

    if (!staffId || isNaN(parseInt(staffId))) {
      return NextResponse.json(
        { message: "Valid Staff ID is required" },
        { status: 400 }
      );
    }

    const { StaffName, Phone, Email, Description } = await request.json();

    if (!StaffName || !Phone || !Email) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const [result]: any = await db.query(
      "UPDATE Staff SET StaffName=?, Phone=?, Email=?, Description=? WHERE staffId=?",
      [StaffName, Phone, Email, Description, parseInt(staffId)]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: "Staff not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Staff Updated successfully",
      staffId: staffId,
    });
  } catch (error) {
    console.error("Error updating staff:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const pathSegments = url.pathname.split("/");
    const staffId = pathSegments[pathSegments.length - 1];

    if (!staffId || isNaN(parseInt(staffId))) {
      return NextResponse.json(
        { message: "Valid Staff ID is required" },
        { status: 400 }
      );
    }

    const [rows] = await db.query(
      "SELECT * FROM Staff WHERE staffId = ?",
      [parseInt(staffId)]
    );

    const staffArray = rows as any[];

    if (!staffArray.length) {
      return NextResponse.json(
        { message: "Staff not found" },
        { status: 404 }
      );
    }

    await db.query(
      "DELETE FROM Staff WHERE staffId = ?",
      [parseInt(staffId)]
    );

    return NextResponse.json({
      message: "Staff Deleted successfully",
      staffId: staffId,
    });
  } catch (error) {
    console.error("Error deleting staff:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
