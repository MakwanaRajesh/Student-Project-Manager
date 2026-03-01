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
    [Route("api/projecttypes")]
    public class ProjectTypesController : ControllerBase
    {
        private readonly AppDbContext _db;

        public ProjectTypesController(AppDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _db.ProjectTypes.ToListAsync());
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var pt = await _db.ProjectTypes.FindAsync(id);
            if (pt == null) return NotFound(new { message = "Project type not found" });
            return Ok(pt);
        }

        [Authorize(Roles = "admin")]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ProjectTypeCreateDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var pt = new ProjectType
            {
                ProjectTypeName = dto.ProjectTypeName,
                Description = dto.Description,
                Created = DateTime.UtcNow,
                Modified = DateTime.UtcNow
            };

            await _db.ProjectTypes.AddAsync(pt);
            await _db.SaveChangesAsync();
            return Ok(pt);
        }

        [Authorize(Roles = "admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] ProjectTypeCreateDto dto)
        {
            var pt = await _db.ProjectTypes.FindAsync(id);
            if (pt == null) return NotFound(new { message = "Project type not found" });

            pt.ProjectTypeName = dto.ProjectTypeName;
            pt.Description = dto.Description;
            pt.Modified = DateTime.UtcNow;

            await _db.SaveChangesAsync();
            return Ok(pt);
        }

        [Authorize(Roles = "admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var pt = await _db.ProjectTypes.FindAsync(id);
            if (pt == null) return NotFound(new { message = "Project type not found" });

            _db.ProjectTypes.Remove(pt);
            await _db.SaveChangesAsync();
            return Ok(new { message = "Project type deleted" });
        }
    }
}
