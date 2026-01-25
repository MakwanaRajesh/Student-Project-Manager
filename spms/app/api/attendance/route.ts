import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const [rows] = await db.query("SELECT * FROM ProjectMeetingAttendance");
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const { ProjectMeetingID, StudentID, IsPresent, AttendanceRemarks } =
    await req.json();

  await db.query(
    `INSERT INTO ProjectMeetingAttendance
     (ProjectMeetingID, StudentID, IsPresent, AttendanceRemarks)
     VALUES (?,?,?,?)`,
    [ProjectMeetingID, StudentID, IsPresent, AttendanceRemarks]
  );

  return NextResponse.json({ message: "Attendance Marked" });
}
