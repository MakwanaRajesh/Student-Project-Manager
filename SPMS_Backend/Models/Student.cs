using System.ComponentModel.DataAnnotations;

namespace SPMS_Backend.Models
{
    public class Student
    {
        [Key]
        public int StudentID { get; set; }

        [Required]
        [MaxLength(200)]
        public string StudentName { get; set; } = string.Empty;

        [Required]
        [MaxLength(200)]
        public string Email { get; set; } = string.Empty;

        [MaxLength(20)]
        public string? Phone { get; set; }

        [Required]
        public string Password { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? Description { get; set; }

        public double CGPA { get; set; } = 0.0;

        public DateTime Created { get; set; } = DateTime.UtcNow;

        public DateTime Modified { get; set; } = DateTime.UtcNow;
    }
}
