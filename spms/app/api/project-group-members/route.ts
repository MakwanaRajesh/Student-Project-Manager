import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const [rows] = await db.query("SELECT * FROM ProjectGroupMember");
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const { ProjectGroupID, StudentID, IsGroupLeader, StudentCGPA } =
    await req.json();

  await db.query(
    `INSERT INTO ProjectGroupMember
     (ProjectGroupID, StudentID, IsGroupLeader, StudentCGPA)
     VALUES (?,?,?,?)`,
    [ProjectGroupID, StudentID, IsGroupLeader, StudentCGPA]
  );

  return NextResponse.json({ message: "Group Member Added" });
}
