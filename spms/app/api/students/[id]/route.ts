import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  try {
    // Parse the ID from the URL
    const url = new URL(request.url);
    const pathSegments = url.pathname.split('/');
    const studentId = pathSegments[pathSegments.length - 1];
    
    console.log("Extracted Student ID:", studentId);
    
    if (!studentId || isNaN(parseInt(studentId))) {
      return NextResponse.json(
        { message: "Valid Student ID is required" },
        { status: 400 }
      );
    }

    const [rows] = await db.query(
      "SELECT * FROM Student WHERE StudentID = ?",
      [parseInt(studentId)]
    );

    const studentArray = rows as any[];

    if (!studentArray.length) {
      return NextResponse.json(
        { message: "Student not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(studentArray[0]);
  } catch (error) {
    console.error("Error fetching student:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const url = new URL(request.url);
    const pathSegments = url.pathname.split('/');
    const studentId = pathSegments[pathSegments.length - 1];
    
    if (!studentId || isNaN(parseInt(studentId))) {
      return NextResponse.json(
        { message: "Valid Student ID is required" },
        { status: 400 }
      );
    }

    const { StudentName, Phone, Email, Description } = await request.json();

    if (!StudentName || !Phone || !Email) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    await db.query(
      "UPDATE Student SET StudentName=?, Phone=?, Email=?, Description=? WHERE StudentID=?",
      [StudentName, Phone, Email, Description, parseInt(studentId)]
    );

    return NextResponse.json({ 
      message: "Student Updated successfully",
      studentId: studentId
    });
  } catch (error) {
    console.error("Error updating student:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const pathSegments = url.pathname.split('/');
    const studentId = pathSegments[pathSegments.length - 1];
    
    if (!studentId || isNaN(parseInt(studentId))) {
      return NextResponse.json(
        { message: "Valid Student ID is required" },
        { status: 400 }
      );
    }

    // First check if student exists
    const [rows] = await db.query(
      "SELECT * FROM Student WHERE StudentID = ?",
      [parseInt(studentId)]
    );

    const studentArray = rows as any[];

    if (!studentArray.length) {
      return NextResponse.json(
        { message: "Student not found" },
        { status: 404 }
      );
    }

    await db.query(
      "DELETE FROM Student WHERE StudentID=?",
      [parseInt(studentId)]
    );

    return NextResponse.json({ 
      message: "Student Deleted successfully",
      studentId: studentId
    });
  } catch (error) {
    console.error("Error deleting student:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}