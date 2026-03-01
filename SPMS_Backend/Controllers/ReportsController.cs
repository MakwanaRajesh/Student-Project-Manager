using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SPMS_Backend.Data;

namespace SPMS_Backend.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/reports")]
    public class ReportsController : ControllerBase
    {
        private readonly AppDbContext _db;

        public ReportsController(AppDbContext db)
        {
            _db = db;
        }

        [HttpGet("dashboard-stats")]
        public async Task<IActionResult> GetDashboardStats()
        {
            var totalStudents = await _db.Students.CountAsync();
            var totalStaff = await _db.Staffs.CountAsync();
            var totalGroups = await _db.ProjectGroups.CountAsync();
            var pendingGroups = await _db.ProjectGroups.CountAsync(g => g.Status == "pending");
            var approvedGroups = await _db.ProjectGroups.CountAsync(g => g.Status == "approved");
            var rejectedGroups = await _db.ProjectGroups.CountAsync(g => g.Status == "rejected");
            var totalMeetings = await _db.ProjectMeetings.CountAsync();
            var scheduledMeetings = await _db.ProjectMeetings.CountAsync(m => m.MeetingStatus == "scheduled");
            var completedMeetings = await _db.ProjectMeetings.CountAsync(m => m.MeetingStatus == "completed");

            return Ok(new
            {
                totalStudents,
                totalStaff,
                totalGroups,
                pendingGroups,
                approvedGroups,
                rejectedGroups,
                totalMeetings,
                scheduledMeetings,
                completedMeetings
            });
        }

        [HttpGet("attendance-summary")]
        public async Task<IActionResult> GetAttendanceSummary()
        {
            var groups = await _db.ProjectGroups
                .Include(g => g.Members)
                .Include(g => g.GuideStaff)
                .ToListAsync();

            var meetings = await _db.ProjectMeetings
                .Include(m => m.Attendances)
                .ToListAsync();

            var summary = groups.Select(g =>
            {
                var groupMeetings = meetings.Where(m => m.ProjectGroupID == g.ProjectGroupID).ToList();
                var totalAttendances = groupMeetings.Sum(m => m.Attendances?.Count ?? 0);
                var presentCount = groupMeetings.Sum(m => m.Attendances?.Count(a => a.IsPresent) ?? 0);

                return new
                {
                    g.ProjectGroupID,
                    g.ProjectGroupName,
                    GuideStaffName = g.GuideStaff?.StaffName,
                    TotalMeetings = groupMeetings.Count,
                    MemberCount = g.Members?.Count ?? 0,
                    TotalAttendances = totalAttendances,
                    PresentCount = presentCount,
                    AttendanceRate = totalAttendances == 0 ? 0 : (double)presentCount / totalAttendances * 100
                };
            });

            return Ok(summary);
        }

        [HttpGet("project-types-breakdown")]
        public async Task<IActionResult> GetProjectTypesBreakdown()
        {
            var types = await _db.ProjectTypes.ToListAsync();
            var groups = await _db.ProjectGroups.ToListAsync();

            var breakdown = types.Select(t => new
            {
                t.ProjectTypeID,
                t.ProjectTypeName,
                Total = groups.Count(g => g.ProjectTypeID == t.ProjectTypeID),
                Pending = groups.Count(g => g.ProjectTypeID == t.ProjectTypeID && g.Status == "pending"),
                Approved = groups.Count(g => g.ProjectTypeID == t.ProjectTypeID && g.Status == "approved"),
                Rejected = groups.Count(g => g.ProjectTypeID == t.ProjectTypeID && g.Status == "rejected")
            });

            return Ok(breakdown);
        }
    }
}
