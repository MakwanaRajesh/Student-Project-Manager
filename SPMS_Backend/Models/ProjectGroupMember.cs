using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SPMS_Backend.Models
{
    public class ProjectGroupMember
    {
        [Key]
        public int ProjectGroupMemberID { get; set; }

        public int ProjectGroupID { get; set; }

        [ForeignKey("ProjectGroupID")]
        public ProjectGroup? ProjectGroup { get; set; }

        public int StudentID { get; set; }

        [ForeignKey("StudentID")]
        public Student? Student { get; set; }

        public bool IsGroupLeader { get; set; } = false;

        public double StudentCGPA { get; set; } = 0.0;

        [MaxLength(500)]
        public string? Description { get; set; }

        public DateTime Created { get; set; } = DateTime.UtcNow;

        public DateTime Modified { get; set; } = DateTime.UtcNow;
    }
}
