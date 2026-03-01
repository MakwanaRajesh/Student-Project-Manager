using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SPMS_Backend.Models
{
    public class ProjectGroup
    {
        [Key]
        public int ProjectGroupID { get; set; }

        [Required]
        [MaxLength(200)]
        public string ProjectGroupName { get; set; } = string.Empty;

        public int ProjectTypeID { get; set; }

        [ForeignKey("ProjectTypeID")]
        public ProjectType? ProjectType { get; set; }

        public int GuideStaffID { get; set; }

        [ForeignKey("GuideStaffID")]
        public Staff? GuideStaff { get; set; }

        [MaxLength(500)]
        public string? ProjectTitle { get; set; }

        [MaxLength(200)]
        public string? ProjectArea { get; set; }

        public string? ProjectDescription { get; set; }

        public double AverageCPI { get; set; } = 0.0;

        public int? ConvenerStaffID { get; set; }

        [ForeignKey("ConvenerStaffID")]
        public Staff? ConvenerStaff { get; set; }

        public int? ExpertStaffID { get; set; }

        [ForeignKey("ExpertStaffID")]
        public Staff? ExpertStaff { get; set; }

        [Required]
        [MaxLength(50)]
        public string Status { get; set; } = "pending"; // pending / approved / rejected

        [MaxLength(500)]
        public string? StatusDescription { get; set; }

        public string? Description { get; set; }

        public DateTime Created { get; set; } = DateTime.UtcNow;

        public DateTime Modified { get; set; } = DateTime.UtcNow;

        // Navigation
        public ICollection<ProjectGroupMember>? Members { get; set; }
    }
}
