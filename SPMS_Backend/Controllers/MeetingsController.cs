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
    [Route("api/meetings")]
    public class MeetingsController : ControllerBase
    {
        private readonly AppDbContext _db;

        public MeetingsController(AppDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var meetings = await _db.ProjectMeetings
                .Include(m => m.ProjectGroup)
                .Include(m => m.GuideStaff)
                .Include(m => m.Attendances)
                    .ThenInclude(a => a.Student)
                .Select(m => new
                {
                    m.ProjectMeetingID,
                    m.ProjectGroupID,

                    GroupName = m.ProjectGroup != null
                        ? m.ProjectGroup.ProjectGroupName
                        : null,

                    m.GuideStaffID,

                    GuideStaffName = m.GuideStaff != null
                        ? m.GuideStaff.StaffName
                        : null,

                    m.MeetingDateTime,
                    m.MeetingPurpose,
                    m.MeetingLocation,
                    m.MeetingNotes,
                    m.MeetingStatus,
                    m.StatusDescription,
                    m.Created,
                    m.Modified,

                    Attendances = m.Attendances.Select(a => new
                    {
                        a.ProjectMeetingAttendanceID,
                        a.ProjectMeetingID,
                        a.StudentID,

                        StudentName = a.Student != null
                            ? a.Student.StudentName
                            : null,

                        a.IsPresent,
                        a.AttendanceRemarks,
                        a.Created
                    }).ToList()
                })
                .ToListAsync();

            return Ok(meetings);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var m = await _db.ProjectMeetings
                .Include(m => m.ProjectGroup)
                .Include(m => m.GuideStaff)
                .Include(m => m.Attendances).ThenInclude(a => a.Student)
                .FirstOrDefaultAsync(m => m.ProjectMeetingID == id);

            if (m == null) return NotFound(new { message = "Meeting not found" });

            return Ok(new
            {
                m.ProjectMeetingID,
                m.ProjectGroupID,
                GroupName = m.ProjectGroup?.ProjectGroupName,
                m.GuideStaffID,
                GuideStaffName = m.GuideStaff?.StaffName,
                m.MeetingDateTime,
                m.MeetingPurpose,
                m.MeetingLocation,
                m.MeetingNotes,
                m.MeetingStatus,
                m.StatusDescription,
                m.Created,
                m.Modified,
                Attendances = m.Attendances?.Select(a => new
                {
                    a.ProjectMeetingAttendanceID,
                    a.ProjectMeetingID,
                    a.StudentID,
                    StudentName = a.Student?.StudentName,
                    a.IsPresent,
                    a.AttendanceRemarks
                })
            });
        }

        [HttpGet("by-group/{groupId}")]
        public async Task<IActionResult> GetByGroup(int groupId)
        {
            var meetings = await _db.ProjectMeetings
                .Include(m => m.GuideStaff)
                .Include(m => m.Attendances).ThenInclude(a => a.Student)
                .Where(m => m.ProjectGroupID == groupId)
                .OrderByDescending(m => m.MeetingDateTime)
                .ToListAsync();

            return Ok(meetings.Select(m => new
            {
                m.ProjectMeetingID,
                m.ProjectGroupID,
                m.GuideStaffID,
                GuideStaffName = m.GuideStaff?.StaffName,
                m.MeetingDateTime,
                m.MeetingPurpose,
                m.MeetingLocation,
                m.MeetingNotes,
                m.MeetingStatus,
                m.StatusDescription,
                m.Created,
                Attendances = m.Attendances?.Select(a => new
                {
                    a.StudentID,
                    StudentName = a.Student?.StudentName,
                    a.IsPresent,
                    a.AttendanceRemarks
                })
            }));
        }

        [HttpGet("by-staff/{staffId}")]
        public async Task<IActionResult> GetByStaff(int staffId)
        {
            var meetings = await _db.ProjectMeetings
                .Include(m => m.ProjectGroup)
                .Include(m => m.Attendances).ThenInclude(a => a.Student)
                .Where(m => m.GuideStaffID == staffId)
                .OrderByDescending(m => m.MeetingDateTime)
                .ToListAsync();

            return Ok(meetings.Select(m => new
            {
                m.ProjectMeetingID,
                m.ProjectGroupID,
                GroupName = m.ProjectGroup?.ProjectGroupName,
                m.GuideStaffID,
                m.MeetingDateTime,
                m.MeetingPurpose,
                m.MeetingLocation,
                m.MeetingNotes,
                m.MeetingStatus,
                m.Created,
                AttendanceCount = m.Attendances?.Count ?? 0
            }));
        }

        [HttpGet("by-student/{studentId}")]
        public async Task<IActionResult> GetByStudent(int studentId)
        {
            // Get groups the student belongs to
            var groupIds = await _db.ProjectGroupMembers
                .Where(m => m.StudentID == studentId)
                .Select(m => m.ProjectGroupID)
                .ToListAsync();

            var meetings = await _db.ProjectMeetings
                .Include(m => m.ProjectGroup)
                .Include(m => m.GuideStaff)
                .Include(m => m.Attendances)
                .Where(m => groupIds.Contains(m.ProjectGroupID))
                .OrderByDescending(m => m.MeetingDateTime)
                .ToListAsync();

            return Ok(meetings.Select(m => new
            {
                m.ProjectMeetingID,
                m.ProjectGroupID,
                GroupName = m.ProjectGroup?.ProjectGroupName,
                m.GuideStaffID,
                GuideStaffName = m.GuideStaff?.StaffName,
                m.MeetingDateTime,
                m.MeetingPurpose,
                m.MeetingLocation,
                m.MeetingStatus,
                MyAttendance = m.Attendances?.FirstOrDefault(a => a.StudentID == studentId)
            }));
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] MeetingCreateDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var meeting = new ProjectMeeting
            {
                ProjectGroupID = dto.ProjectGroupID,
                GuideStaffID = dto.GuideStaffID,
                MeetingDateTime = dto.MeetingDateTime,
                MeetingPurpose = dto.MeetingPurpose,
                MeetingLocation = dto.MeetingLocation,
                MeetingNotes = dto.MeetingNotes,
                MeetingStatus = "scheduled",
                Created = DateTime.UtcNow,
                Modified = DateTime.UtcNow
            };

            await _db.ProjectMeetings.AddAsync(meeting);
            await _db.SaveChangesAsync();

            // Auto-create attendance records for all group members
            var members = await _db.ProjectGroupMembers
                .Where(m => m.ProjectGroupID == dto.ProjectGroupID)
                .ToListAsync();

            foreach (var member in members)
            {
                await _db.ProjectMeetingAttendances.AddAsync(new ProjectMeetingAttendance
                {
                    ProjectMeetingID = meeting.ProjectMeetingID,
                    StudentID = member.StudentID,
                    IsPresent = false,
                    Created = DateTime.UtcNow,
                    Modified = DateTime.UtcNow
                });
            }

            await _db.SaveChangesAsync();
            return Ok(new { meeting.ProjectMeetingID, meeting.MeetingStatus, meeting.MeetingDateTime });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] MeetingUpdateDto dto)
        {
            var meeting = await _db.ProjectMeetings.FindAsync(id);
            if (meeting == null) return NotFound(new { message = "Meeting not found" });

            if (dto.MeetingDateTime.HasValue) meeting.MeetingDateTime = dto.MeetingDateTime.Value;
            if (dto.MeetingPurpose != null) meeting.MeetingPurpose = dto.MeetingPurpose;
            if (dto.MeetingLocation != null) meeting.MeetingLocation = dto.MeetingLocation;
            if (dto.MeetingNotes != null) meeting.MeetingNotes = dto.MeetingNotes;
            if (dto.MeetingStatus != null) meeting.MeetingStatus = dto.MeetingStatus;
            if (dto.StatusDescription != null) meeting.StatusDescription = dto.StatusDescription;
            meeting.Modified = DateTime.UtcNow;

            await _db.SaveChangesAsync();
            return Ok(new { meeting.ProjectMeetingID, meeting.MeetingStatus });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var meeting = await _db.ProjectMeetings.FindAsync(id);
            if (meeting == null) return NotFound(new { message = "Meeting not found" });

            _db.ProjectMeetings.Remove(meeting);
            await _db.SaveChangesAsync();
            return Ok(new { message = "Meeting deleted" });
        }
    }
}
