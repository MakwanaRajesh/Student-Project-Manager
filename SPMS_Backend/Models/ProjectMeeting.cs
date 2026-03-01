using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SPMS_Backend.Models
{
    public class ProjectMeeting
    {
        [Key]
        public int ProjectMeetingID { get; set; }

        public int ProjectGroupID { get; set; }

        [ForeignKey("ProjectGroupID")]
        public ProjectGroup? ProjectGroup { get; set; }

        public int GuideStaffID { get; set; }

        [ForeignKey("GuideStaffID")]
        public Staff? GuideStaff { get; set; }

        public DateTime MeetingDateTime { get; set; }

        [Required]
        [MaxLength(500)]
        public string MeetingPurpose { get; set; } = string.Empty;

        [MaxLength(300)]
        public string? MeetingLocation { get; set; }

        public string? MeetingNotes { get; set; }

        [Required]
        [MaxLength(50)]
        public string MeetingStatus { get; set; } = "scheduled"; // scheduled / completed / cancelled

        [MaxLength(500)]
        public string? StatusDescription { get; set; }

        public DateTime Created { get; set; } = DateTime.UtcNow;

        public DateTime Modified { get; set; } = DateTime.UtcNow;

        // Navigation
        public ICollection<ProjectMeetingAttendance>? Attendances { get; set; }
    }
}
