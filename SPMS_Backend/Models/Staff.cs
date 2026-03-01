using System.ComponentModel.DataAnnotations;

namespace SPMS_Backend.Models
{
    public class Staff
    {
        [Key]
        public int StaffID { get; set; }

        [Required]
        [MaxLength(200)]
        public string StaffName { get; set; } = string.Empty;

        [Required]
        [MaxLength(200)]
        public string Email { get; set; } = string.Empty;

        [MaxLength(20)]
        public string? Phone { get; set; }

        [Required]
        public string Password { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        public string Role { get; set; } = "Faculty"; // Admin / Faculty

        [MaxLength(500)]
        public string? Description { get; set; }

        public DateTime Created { get; set; } = DateTime.UtcNow;

        public DateTime Modified { get; set; } = DateTime.UtcNow;
    }
}
