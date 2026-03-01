using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SPMS_Backend.Data;
using SPMS_Backend.DTOs;
using SPMS_Backend.Models;

namespace SPMS_Backend.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/attendance")]
    public class AttendanceController : ControllerBase
    {
        private readonly AppDbContext _db;

        public AttendanceController(AppDbContext db)
        {
            _db = db;
        }

        [HttpGet("by-meeting/{meetingId}")]
        public async Task<IActionResult> GetByMeeting(int meetingId)
        {
            var records = await _db.ProjectMeetingAttendances
                .Include(a => a.Student)
                .Where(a => a.ProjectMeetingID == meetingId)
                .Select(a => new
                {
                    a.ProjectMeetingAttendanceID,
                    a.ProjectMeetingID,
                    a.StudentID,
                    StudentName = a.Student != null ? a.Student.StudentName : null,
                    StudentEmail = a.Student != null ? a.Student.Email : null,
                    a.IsPresent,
                    a.AttendanceRemarks,
                    a.Created,
                    a.Modified
                })
                .ToListAsync();
            return Ok(records);
        }

        [HttpGet("by-student/{studentId}")]
        public async Task<IActionResult> GetByStudent(int studentId)
        {
            var records = await _db.ProjectMeetingAttendances
                .Include(a => a.ProjectMeeting).ThenInclude(m => m!.ProjectGroup)
                .Where(a => a.StudentID == studentId)
                .Select(a => new
                {
                    a.ProjectMeetingAttendanceID,
                    a.ProjectMeetingID,
                    a.StudentID,
                    a.IsPresent,
                    a.AttendanceRemarks,
                    a.Created,
                    MeetingDateTime = a.ProjectMeeting != null ? a.ProjectMeeting.MeetingDateTime : (DateTime?)null,
                    MeetingPurpose = a.ProjectMeeting != null ? a.ProjectMeeting.MeetingPurpose : null,
                    GroupName = a.ProjectMeeting != null && a.ProjectMeeting.ProjectGroup != null
                        ? a.ProjectMeeting.ProjectGroup.ProjectGroupName : null
                })
                .ToListAsync();
            return Ok(records);
        }

        /// <summary>
        /// Bulk update attendance for a meeting
        /// </summary>
        [HttpPost("update/{meetingId}")]
        public async Task<IActionResult> UpdateAttendance(int meetingId, [FromBody] AttendanceUpdateDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var meeting = await _db.ProjectMeetings.FindAsync(meetingId);
            if (meeting == null) return NotFound(new { message = "Meeting not found" });

            foreach (var item in dto.Attendances)
            {
                var existing = await _db.ProjectMeetingAttendances
                    .FirstOrDefaultAsync(a => a.ProjectMeetingID == meetingId && a.StudentID == item.StudentID);

                if (existing != null)
                {
                    existing.IsPresent = item.IsPresent;
                    existing.AttendanceRemarks = item.AttendanceRemarks;
                    existing.Modified = DateTime.UtcNow;
                }
                else
                {
                    await _db.ProjectMeetingAttendances.AddAsync(new ProjectMeetingAttendance
                    {
                        ProjectMeetingID = meetingId,
                        StudentID = item.StudentID,
                        IsPresent = item.IsPresent,
                        AttendanceRemarks = item.AttendanceRemarks,
                        Created = DateTime.UtcNow,
                        Modified = DateTime.UtcNow
                    });
                }
            }

            // Mark meeting as completed if attendance is being updated
            if (meeting.MeetingStatus == "scheduled")
            {
                meeting.MeetingStatus = "completed";
                meeting.Modified = DateTime.UtcNow;
            }

            await _db.SaveChangesAsync();
            return Ok(new { message = "Attendance updated successfully", meetingId });
        }

        [HttpGet("report/by-group/{groupId}")]
        public async Task<IActionResult> GetAttendanceReport(int groupId)
        {
            var meetings = await _db.ProjectMeetings
                .Include(m => m.Attendances).ThenInclude(a => a.Student)
                .Where(m => m.ProjectGroupID == groupId)
                .OrderBy(m => m.MeetingDateTime)
                .ToListAsync();

            var members = await _db.ProjectGroupMembers
                .Include(m => m.Student)
                .Where(m => m.ProjectGroupID == groupId)
                .ToListAsync();

            var report = members.Select(member => new
            {
                member.StudentID,
                StudentName = member.Student?.StudentName,
                TotalMeetings = meetings.Count,
                AttendedMeetings = meetings.Count(m =>
                    m.Attendances != null && m.Attendances.Any(a => a.StudentID == member.StudentID && a.IsPresent)),
                AttendancePercentage = meetings.Count == 0 ? 0 :
                    (double)meetings.Count(m =>
                        m.Attendances != null && m.Attendances.Any(a => a.StudentID == member.StudentID && a.IsPresent))
                    / meetings.Count * 100
            });

            return Ok(report);
        }
    }
}
