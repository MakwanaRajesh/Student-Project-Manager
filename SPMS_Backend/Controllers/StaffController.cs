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
    [Route("api/staff")]
    public class StaffController : ControllerBase
    {
        private readonly AppDbContext _db;

        public StaffController(AppDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var staff = await _db.Staffs
                .Select(s => new
                {
                    s.StaffID,
                    s.StaffName,
                    s.Email,
                    s.Phone,
                    s.Role,
                    s.Description,
                    s.Created,
                    s.Modified
                })
                .ToListAsync();
            return Ok(staff);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var s = await _db.Staffs.FindAsync(id);
            if (s == null) return NotFound(new { message = "Staff not found" });

            return Ok(new
            {
                s.StaffID,
                s.StaffName,
                s.Email,
                s.Phone,
                s.Role,
                s.Description,
                s.Created,
                s.Modified
            });
        }

        [Authorize(Roles = "admin")]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] StaffCreateDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var exists = await _db.Staffs.AnyAsync(x => x.Email == dto.Email);
            if (exists) return BadRequest(new { message = "Email already exists" });

            var staff = new Staff
            {
                StaffName = dto.StaffName,
                Email = dto.Email,
                Phone = dto.Phone,
                Password = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Role = dto.Role,
                Description = dto.Description,
                Created = DateTime.UtcNow,
                Modified = DateTime.UtcNow
            };

            await _db.Staffs.AddAsync(staff);
            await _db.SaveChangesAsync();

            return Ok(new { staff.StaffID, staff.StaffName, staff.Email, staff.Role, staff.Created });
        }

        [Authorize(Roles = "admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] StaffUpdateDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var staff = await _db.Staffs.FindAsync(id);
            if (staff == null) return NotFound(new { message = "Staff not found" });

            staff.StaffName = dto.StaffName;
            staff.Email = dto.Email;
            staff.Phone = dto.Phone;
            staff.Description = dto.Description;
            staff.Role = dto.Role;
            staff.Modified = DateTime.UtcNow;

            await _db.SaveChangesAsync();
            return Ok(new { staff.StaffID, staff.StaffName, staff.Email, staff.Role, staff.Modified });
        }

        [Authorize(Roles = "admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var staff = await _db.Staffs.FindAsync(id);
            if (staff == null) return NotFound(new { message = "Staff not found" });

            _db.Staffs.Remove(staff);
            await _db.SaveChangesAsync();
            return Ok(new { message = "Staff deleted successfully" });
        }

        [Authorize(Roles = "admin")]
        [HttpPost("{id}/reset-password")]
        public async Task<IActionResult> ResetPassword(int id, [FromBody] ResetPasswordDto dto)
        {
            var staff = await _db.Staffs.FindAsync(id);
            if (staff == null) return NotFound(new { message = "Staff not found" });

            staff.Password = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
            staff.Modified = DateTime.UtcNow;
            await _db.SaveChangesAsync();

            return Ok(new { message = "Password reset successfully" });
        }
    }

    public class ResetPasswordDto
    {
        public string NewPassword { get; set; } = string.Empty;
    }
}
