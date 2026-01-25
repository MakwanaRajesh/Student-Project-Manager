import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  request: Request
//   { params }: { params: { id: string } }
) {
  try {
    const url = new URL(request.url);
    const pathSegments = url.pathname.split('/');
    const meetingId = pathSegments[pathSegments.length - 1];
    // const meetingId = Number(params.id);

    console.log("ProjectMeeting ID:", meetingId);
    console.log("Type of meetingId:", typeof meetingId);

    // validation
    // if (isNaN(meetingId)) {
    //   return NextResponse.json(
    //     { error: "Invalid ProjectMeeting ID" },
    //     { status: 400 }
    //   );
    // }

    if (!meetingId || isNaN(parseInt(meetingId))) {
      return NextResponse.json(
        { message: "Valid Meeting ID is required" },
        { status: 400 }
      );
    }

    const [rows]: any = await db.query(
    //   `
    //   SELECT
    //     pm.ProjectMeetingID,
    //     pm.ProjectGroupID,
    //     s.StaffName AS GuideStaffName,
    //     pm.MeetingDateTime,
    //     pm.MeetingPurpose,
    //     pm.MeetingLocation,
    //     pm.MeetingNotes,
    //     pm.MeetingStatus,
    //     pm.MeetingStatusDescription,
    //     pm.MeetingStatusDatetime,
    //     pm.Description
    //   FROM ProjectMeeting pm
    //   JOIN Staff s ON s.StaffID = pm.GuideStaffID
    //   WHERE pm.ProjectMeetingID = ?
    //   `,
    "SELECT * FROM ProjectMeeting WHERE ProjectMeetingID = ?"
      [parseInt(meetingId)]
    );

    const meetingArray= rows as any[];

    if (!meetingArray.length) {
      return NextResponse.json(
        { message: "Project Meeting not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(meetingArray[0]);
  } catch (error) {
    console.error("ProjectMeeting [id] GET error", error);
    return NextResponse.json(
      { message: "Failed to fetch Project Meeting" },
      { status: 500 }
    );
  }
}
