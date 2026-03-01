using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SPMS_Backend.Data;
using SPMS_Backend.DTOs;
using SPMS_Backend.Helpers;

namespace SPMS_Backend.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly JwtHelper _jwt;

        public AuthController(AppDbContext db, JwtHelper jwt)
        {
            _db = db;
            _jwt = jwt;
        }

        /// <summary>
        /// Login for Staff (Admin/Faculty) or Student
        /// Role: "admin" / "faculty" / "student"
        /// </summary>
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (request.Role.ToLower() == "student")
            {
                var student = await _db.Students
                    .FirstOrDefaultAsync(x => x.Email.ToLower() == request.Email.ToLower());

                if (student == null || !BCrypt.Net.BCrypt.Verify(request.Password, student.Password))
                    return Unauthorized(new { success = false, message = "Invalid credentials" });

                var token = _jwt.GenerateToken(student.StudentID, student.StudentName, student.Email, "student");

                return Ok(new LoginResponseDto
                {
                    Success = true,
                    Token = token,
                    Role = "student",
                    Name = student.StudentName,
                    Email = student.Email,
                    UserId = student.StudentID
                });
            }
            else
            {
                // Admin or Faculty - check in Staff table
                var staff = await _db.Staffs
                    .FirstOrDefaultAsync(x => x.Email.ToLower() == request.Email.ToLower());

                if (staff == null || !BCrypt.Net.BCrypt.Verify(request.Password, staff.Password))
                    return Unauthorized(new { success = false, message = "Invalid credentials" });

                var roleMatch = request.Role.ToLower() == staff.Role.ToLower();
                if (!roleMatch)
                    return Unauthorized(new { success = false, message = "Role mismatch" });

                var token = _jwt.GenerateToken(staff.StaffID, staff.StaffName, staff.Email, staff.Role.ToLower());

                return Ok(new LoginResponseDto
                {
                    Success = true,
                    Token = token,
                    Role = staff.Role.ToLower(),
                    Name = staff.StaffName,
                    Email = staff.Email,
                    UserId = staff.StaffID
                });
            }
        }
    }
}
