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
    [Route("api/groupmembers")]
    public class GroupMembersController : ControllerBase
    {
        private readonly AppDbContext _db;

        public GroupMembersController(AppDbContext db)
        {
            _db = db;
        }

        [HttpGet("by-group/{groupId}")]
        public async Task<IActionResult> GetByGroup(int groupId)
        {
            var members = await _db.ProjectGroupMembers
                .Include(m => m.Student)
                .Where(m => m.ProjectGroupID == groupId)
                .Select(m => new
                {
                    m.ProjectGroupMemberID,
                    m.ProjectGroupID,
                    m.StudentID,
                    StudentName = m.Student != null ? m.Student.StudentName : null,
                    StudentEmail = m.Student != null ? m.Student.Email : null,
                    StudentPhone = m.Student != null ? m.Student.Phone : null,
                    m.IsGroupLeader,
                    m.StudentCGPA,
                    m.Description,
                    m.Created
                })
                .ToListAsync();
            return Ok(members);
        }

        [HttpPost]
        public async Task<IActionResult> AddMember([FromBody] ProjectGroupMemberCreateDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            // Check if student already in group
            var exists = await _db.ProjectGroupMembers
                .AnyAsync(m => m.ProjectGroupID == dto.StudentID);

            var member = new ProjectGroupMember
            {
                ProjectGroupID = dto.StudentID, // NOTE: This will be set from route
                StudentID = dto.StudentID,
                IsGroupLeader = dto.IsGroupLeader,
                StudentCGPA = dto.StudentCGPA,
                Description = dto.Description,
                Created = DateTime.UtcNow,
                Modified = DateTime.UtcNow
            };

            await _db.ProjectGroupMembers.AddAsync(member);
            await _db.SaveChangesAsync();
            return Ok(member);
        }

        [HttpPost("add-to-group/{groupId}")]
        public async Task<IActionResult> AddMemberToGroup(int groupId, [FromBody] ProjectGroupMemberCreateDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var group = await _db.ProjectGroups.FindAsync(groupId);
            if (group == null) return NotFound(new { message = "Group not found" });

            var already = await _db.ProjectGroupMembers
                .AnyAsync(m => m.ProjectGroupID == groupId && m.StudentID == dto.StudentID);
            if (already) return BadRequest(new { message = "Student already in group" });

            var member = new ProjectGroupMember
            {
                ProjectGroupID = groupId,
                StudentID = dto.StudentID,
                IsGroupLeader = dto.IsGroupLeader,
                StudentCGPA = dto.StudentCGPA,
                Description = dto.Description,
                Created = DateTime.UtcNow,
                Modified = DateTime.UtcNow
            };

            await _db.ProjectGroupMembers.AddAsync(member);

            // Update group average CPI
            var allMembers = await _db.ProjectGroupMembers.Where(m => m.ProjectGroupID == groupId).ToListAsync();
            allMembers.Add(member);
            group.AverageCPI = allMembers.Average(m => m.StudentCGPA);
            group.Modified = DateTime.UtcNow;

            await _db.SaveChangesAsync();
            return Ok(member);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var member = await _db.ProjectGroupMembers.FindAsync(id);
            if (member == null) return NotFound(new { message = "Member not found" });

            _db.ProjectGroupMembers.Remove(member);
            await _db.SaveChangesAsync();
            return Ok(new { message = "Member removed from group" });
        }
    }
}
