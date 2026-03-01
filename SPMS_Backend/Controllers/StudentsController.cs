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
    [Route("api/students")]
    public class StudentsController : ControllerBase
    {
        private readonly AppDbContext _db;

        public StudentsController(AppDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var students = await _db.Students
                .Select(s => new
                {
                    s.StudentID,
                    s.StudentName,
                    s.Email,
                    s.Phone,
                    s.CGPA,
                    s.Description,
                    s.Created,
                    s.Modified
                })
                .ToListAsync();
            return Ok(students);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var s = await _db.Students.FindAsync(id);
            if (s == null) return NotFound(new { message = "Student not found" });

            return Ok(new
            {
                s.StudentID,
                s.StudentName,
                s.Email,
                s.Phone,
                s.CGPA,
                s.Description,
                s.Created,
                s.Modified
            });
        }

        [HttpGet("by-email/{email}")]
        public async Task<IActionResult> GetByEmail(string email)
        {
            var s = await _db.Students.FirstOrDefaultAsync(x => x.Email.ToLower() == email.ToLower());
            if (s == null) return NotFound(new { message = "Student not found" });

            return Ok(new
            {
                s.StudentID,
                s.StudentName,
                s.Email,
                s.Phone,
                s.CGPA,
                s.Description,
                s.Created,
                s.Modified
            });
        }

        [Authorize(Roles = "admin")]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] StudentCreateDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var exists = await _db.Students.AnyAsync(x => x.Email == dto.Email);
            if (exists) return BadRequest(new { message = "Email already exists" });

            var student = new Student
            {
                StudentName = dto.StudentName,
                Email = dto.Email,
                Phone = dto.Phone,
                Password = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Description = dto.Description,
                CGPA = dto.CGPA,
                Created = DateTime.UtcNow,
                Modified = DateTime.UtcNow
            };

            await _db.Students.AddAsync(student);
            await _db.SaveChangesAsync();

            return Ok(new { student.StudentID, student.StudentName, student.Email, student.CGPA, student.Created });
        }

        [Authorize(Roles = "admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] StudentUpdateDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var student = await _db.Students.FindAsync(id);
            if (student == null) return NotFound(new { message = "Student not found" });

            student.StudentName = dto.StudentName;
            student.Email = dto.Email;
            student.Phone = dto.Phone;
            student.Description = dto.Description;
            student.CGPA = dto.CGPA;
            student.Modified = DateTime.UtcNow;

            await _db.SaveChangesAsync();
            return Ok(new { student.StudentID, student.StudentName, student.Email, student.CGPA, student.Modified });
        }

        [Authorize(Roles = "admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var student = await _db.Students.FindAsync(id);
            if (student == null) return NotFound(new { message = "Student not found" });

            _db.Students.Remove(student);
            await _db.SaveChangesAsync();
            return Ok(new { message = "Student deleted successfully" });
        }
    }
}
