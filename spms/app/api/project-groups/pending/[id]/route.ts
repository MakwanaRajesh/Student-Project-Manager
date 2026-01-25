import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { status } = body

    if (!status || !["approved", "rejected"].includes(status)) {
      return NextResponse.json(
        { message: "Invalid status" },
        { status: 400 }
      )
    }

    await db.query(
      `UPDATE ProjectGroup SET Description = ? WHERE ProjectGroupID = ?`,
      [status === "approved" ? "Approved" : "Rejected", params.id]
    )

    return NextResponse.json({ message: "Status updated" })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: "Update failed" },
      { status: 500 }
    )
  }
}
