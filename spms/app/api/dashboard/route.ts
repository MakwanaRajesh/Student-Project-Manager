import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    try{
        const[[students]] : any =await db.query(`SELECT Count(*) AS TotalStudents FROM Student`);

        const[[staffs]] : any = await db.query("SELECT COUNT(*) AS TotalStaffs FROM Staff");

        const [[project]] : any = await db.query("SELECT COUNT(*) AS TotalProjects FROM ProjectGroup");

        const [[projectType]] : any = await db.query("SELECT COUNT(*) AS TotalTypes FROM ProjectType");

        return NextResponse.json({
            totalStudents: students.TotalStudents,
            totalStaffs: staffs.TotalStaffs,
            totalProjects: project.TotalProjects,
            totalProjectTypes: projectType.TotalTypes,
        });

    } catch (error) {
        console.error("Dashboard Count Error", error);

        return NextResponse.json(
            { message : "Failed to load dashboard count"},
            { status: 500}
        );
    }
}