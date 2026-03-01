using System.ComponentModel.DataAnnotations;

namespace SPMS_Backend.Models
{
    public class ProjectType
    {
        [Key]
        public int ProjectTypeID { get; set; }

        [Required]
        [MaxLength(200)]
        public string ProjectTypeName { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? Description { get; set; }

        public DateTime Created { get; set; } = DateTime.UtcNow;

        public DateTime Modified { get; set; } = DateTime.UtcNow;
    }
}
