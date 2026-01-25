// import { NextResponse } from "next/server";
// import { db } from "@/lib/db";

// export async function GET() {
//   const [rows] = await db.query("SELECT * FROM Student");
//   return NextResponse.json(rows);
// }

// export async function POST(req: Request) {
//   const { StudentName, Phone, Email, Password, Description } = await req.json();

//   await db.query(
//     "INSERT INTO Student (StudentName, Phone, Email,Password,  Description) VALUES (?,?,?,?)",
//     [StudentName, Phone, Email, Password, Description]
//   );

//   return NextResponse.json({ message: "Student Added" });
// }
import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  const [rows] = await db.query("SELECT * FROM Student")
  return NextResponse.json(rows)
}

export async function POST(req: Request) {
  const { StudentName, Phone, Email, Description } = await req.json()

  await db.query(
    "INSERT INTO Student (StudentName, Phone, Email, Description) VALUES (?,?,?,?)",
    [StudentName, Phone, Email, Description]
  )

  return NextResponse.json({ message: "Student Added" })
}
