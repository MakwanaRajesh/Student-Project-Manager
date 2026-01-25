import { NextResponse } from "next/server"
import { db } from "@/lib/db"

/* =======================
   GET (TEST / DEBUG)
======================= */
export async function GET() {
  const [rows]: any = await db.query(
    "SELECT UserLoginID, UserID, UserRole, Email, IsActive FROM UserLogin"
  )

  return NextResponse.json(rows)
}

/* =======================
   POST (LOGIN)
======================= */
export async function POST(req: Request) {
  try {
    const { email, password, role } = await req.json()

    // ✅ Validation
    if (!email || !password || !role) {
      return NextResponse.json(
        { error: "Email, password and role are required" },
        { status: 400 }
      )
    }

    // ✅ Find user
    const [rows]: any = await db.query(
      `SELECT * FROM UserLogin
       WHERE Email = ? AND UserRole = ? AND IsActive = 1`,
      [email, role]
    )

    if (!rows.length) {
      return NextResponse.json(
        { error: "Invalid email or role" },
        { status: 401 }
      )
    }

    const user = rows[0]

    // ✅ Plain password check (no bcrypt)
    if (user.PasswordHash !== password) {
      return NextResponse.json(
        { error: "Invalid password" },
        { status: 401 }
      )
    }

    // ✅ Update last login
    await db.query(
      "UPDATE UserLogin SET LastLogin = NOW() WHERE UserLoginID = ?",
      [user.UserLoginID]
    )

    return NextResponse.json({
      success: true,
      user: {
        id: user.UserID,
        role: user.UserRole,
        email: user.Email,
      },
    })
  } catch (error) {
    console.error("LOGIN API ERROR:", error)
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    )
  }
}
