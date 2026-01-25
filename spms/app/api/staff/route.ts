import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const [rows] = await db.query("SELECT * FROM Staff");
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const body = await req.json();

  await db.query(
    "INSERT INTO Staff (StaffName, Phone, Email, Password, Description) VALUES (?,?,?,?,?)",
    [
      body.StaffName,
      body.Phone,
      body.Email,
      body.Password,
      body.Description,
    ]
  );

  return NextResponse.json({ message: "Staff Added" });
}
