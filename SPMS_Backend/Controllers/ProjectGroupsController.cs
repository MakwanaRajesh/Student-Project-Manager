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
    [Route("api/projectgroups")]
    public class ProjectGroupsController : ControllerBase
    {
        private readonly AppDbContext _db;

        public ProjectGroupsController(AppDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var groups = await _db.ProjectGroups
                .Include(g => g.ProjectType)
                .Include(g => g.GuideStaff)
                .Include(g => g.ConvenerStaff)
                .Include(g => g.ExpertStaff)
                .Include(g => g.Members)
                    .ThenInclude(m => m.Student)

                .Select(g => new
                {
                    g.ProjectGroupID,
                    g.ProjectGroupName,

                    g.ProjectTypeID,
                    ProjectTypeName = g.ProjectType != null
                        ? g.ProjectType.ProjectTypeName
                        : null,

                    g.GuideStaffID,
                    GuideStaffName = g.GuideStaff != null
                        ? g.GuideStaff.StaffName
                        : null,

                    g.ProjectTitle,
                    g.ProjectArea,
                    g.ProjectDescription,
                    g.AverageCPI,

                    g.ConvenerStaffID,
                    ConvenerStaffName = g.ConvenerStaff != null
                        ? g.ConvenerStaff.StaffName
                        : null,

                    g.ExpertStaffID,
                    ExpertStaffName = g.ExpertStaff != null
                        ? g.ExpertStaff.StaffName
                        : null,

                    g.Status,
                    g.StatusDescription,
                    g.Description,
                    g.Created,
                    g.Modified,

                    // ? FIXED: No ternary here
                    Members = g.Members.Select(m => new
                    {
                        m.ProjectGroupMemberID,
                        m.ProjectGroupID,
                        m.StudentID,

                        StudentName = m.Student != null
                            ? m.Student.StudentName
                            : null,

                        StudentEmail = m.Student != null
                            ? m.Student.Email
                            : null,

                        m.IsGroupLeader,
                        m.StudentCGPA,
                        m.Description,
                        m.Created
                    }).ToList()
                })
                .ToListAsync();

            return Ok(groups);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var g = await _db.ProjectGroups
                .Include(g => g.ProjectType)
                .Include(g => g.GuideStaff)
                .Include(g => g.ConvenerStaff)
                .Include(g => g.ExpertStaff)
                .Include(g => g.Members)
                    .ThenInclude(m => m.Student)
                .FirstOrDefaultAsync(g => g.ProjectGroupID == id);

            if (g == null) return NotFound(new { message = "Project group not found" });

            return Ok(new
            {
                g.ProjectGroupID,
                g.ProjectGroupName,
                g.ProjectTypeID,
                ProjectTypeName = g.ProjectType?.ProjectTypeName,
                g.GuideStaffID,
                GuideStaffName = g.GuideStaff?.StaffName,
                g.ProjectTitle,
                g.ProjectArea,
                g.ProjectDescription,
                g.AverageCPI,
                g.ConvenerStaffID,
                ConvenerStaffName = g.ConvenerStaff?.StaffName,
                g.ExpertStaffID,
                ExpertStaffName = g.ExpertStaff?.StaffName,
                g.Status,
                g.StatusDescription,
                g.Description,
                g.Created,
                g.Modified,
                Members = g.Members?.Select(m => new
                {
                    m.ProjectGroupMemberID,
                    m.ProjectGroupID,
                    m.StudentID,
                    StudentName = m.Student?.StudentName,
                    StudentEmail = m.Student?.Email,
                    m.IsGroupLeader,
                    m.StudentCGPA,
                    m.Description,
                    m.Created
                })
            });
        }

        [HttpGet("by-staff/{staffId}")]
        public async Task<IActionResult> GetByStaff(int staffId)
        {
            var groups = await _db.ProjectGroups
                .Include(g => g.ProjectType)
                .Include(g => g.Members).ThenInclude(m => m.Student)
                .Where(g => g.GuideStaffID == staffId)
                .ToListAsync();

            return Ok(groups.Select(g => new
            {
                g.ProjectGroupID,
                g.ProjectGroupName,
                g.ProjectTypeID,
                g.GuideStaffID,
                g.ProjectTitle,
                g.ProjectArea,
                g.AverageCPI,
                g.Status,
                g.Created,
                MemberCount = g.Members?.Count ?? 0
            }));
        }

        [HttpGet("by-student/{studentId}")]
        public async Task<IActionResult> GetByStudent(int studentId)
        {
            var groups = await _db.ProjectGroups
                .Include(g => g.ProjectType)
                .Include(g => g.GuideStaff)
                .Include(g => g.Members).ThenInclude(m => m.Student)
                .Where(g => g.Members != null && g.Members.Any(m => m.StudentID == studentId))
                .ToListAsync();

            return Ok(groups.Select(g => new
            {
                g.ProjectGroupID,
                g.ProjectGroupName,
                g.ProjectTypeID,
                ProjectTypeName = g.ProjectType?.ProjectTypeName,
                g.GuideStaffID,
                GuideStaffName = g.GuideStaff?.StaffName,
                g.ProjectTitle,
                g.ProjectArea,
                g.AverageCPI,
                g.Status,
                g.Created,
                Members = g.Members?.Select(m => new
                {
                    m.ProjectGroupMemberID,
                    m.StudentID,
                    StudentName = m.Student?.StudentName,
                    m.IsGroupLeader,
                    m.StudentCGPA
                })
            }));
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ProjectGroupCreateDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var avgCpi = dto.Members.Any() ? dto.Members.Average(m => m.StudentCGPA) : 0;

            var group = new ProjectGroup
            {
                ProjectGroupName = dto.ProjectGroupName,
                ProjectTypeID = dto.ProjectTypeID,
                GuideStaffID = dto.GuideStaffID,
                ProjectTitle = dto.ProjectTitle,
                ProjectArea = dto.ProjectArea,
                ProjectDescription = dto.ProjectDescription,
                AverageCPI = avgCpi,
                ConvenerStaffID = dto.ConvenerStaffID,
                ExpertStaffID = dto.ExpertStaffID,
                Status = "pending",
                Description = dto.Description,
                Created = DateTime.UtcNow,
                Modified = DateTime.UtcNow
            };

            await _db.ProjectGroups.AddAsync(group);
            await _db.SaveChangesAsync();

            // Add members
            foreach (var m in dto.Members)
            {
                await _db.ProjectGroupMembers.AddAsync(new ProjectGroupMember
                {
                    ProjectGroupID = group.ProjectGroupID,
                    StudentID = m.StudentID,
                    IsGroupLeader = m.IsGroupLeader,
                    StudentCGPA = m.StudentCGPA,
                    Description = m.Description,
                    Created = DateTime.UtcNow,
                    Modified = DateTime.UtcNow
                });
            }

            await _db.SaveChangesAsync();
            return Ok(new { group.ProjectGroupID, group.ProjectGroupName, group.Status });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] ProjectGroupCreateDto dto)
        {
            var group = await _db.ProjectGroups
                .Include(g => g.Members)
                .FirstOrDefaultAsync(g => g.ProjectGroupID == id);

            if (group == null) return NotFound(new { message = "Project group not found" });

            group.ProjectGroupName = dto.ProjectGroupName;
            group.ProjectTypeID = dto.ProjectTypeID;
            group.GuideStaffID = dto.GuideStaffID;
            group.ProjectTitle = dto.ProjectTitle;
            group.ProjectArea = dto.ProjectArea;
            group.ProjectDescription = dto.ProjectDescription;
            group.ConvenerStaffID = dto.ConvenerStaffID;
            group.ExpertStaffID = dto.ExpertStaffID;
            group.Description = dto.Description;
            group.AverageCPI = dto.Members.Any() ? dto.Members.Average(m => m.StudentCGPA) : group.AverageCPI;
            group.Modified = DateTime.UtcNow;

            await _db.SaveChangesAsync();
            return Ok(new { group.ProjectGroupID, group.ProjectGroupName, group.Status });
        }

        [Authorize(Roles = "admin,faculty")]
        [HttpPatch("{id}/status")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] ProjectGroupStatusDto dto)
        {
            var group = await _db.ProjectGroups.FindAsync(id);
            if (group == null) return NotFound(new { message = "Project group not found" });

            group.Status = dto.Status.ToLower();
            group.StatusDescription = dto.StatusDescription;
            group.Modified = DateTime.UtcNow;

            await _db.SaveChangesAsync();
            return Ok(new { group.ProjectGroupID, group.Status, group.StatusDescription });
        }

        [Authorize(Roles = "admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var group = await _db.ProjectGroups.FindAsync(id);
            if (group == null) return NotFound(new { message = "Project group not found" });

            _db.ProjectGroups.Remove(group);
            await _db.SaveChangesAsync();
            return Ok(new { message = "Project group deleted" });
        }
    }
}
