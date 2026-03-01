using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SPMS_Backend.Models
{
    public class ProjectMeetingAttendance
    {
        [Key]
        public int ProjectMeetingAttendanceID { get; set; }

        public int ProjectMeetingID { get; set; }

        [ForeignKey("ProjectMeetingID")]
        public ProjectMeeting? ProjectMeeting { get; set; }

        public int StudentID { get; set; }

        [ForeignKey("StudentID")]
        public Student? Student { get; set; }

        public bool IsPresent { get; set; } = false;

        [MaxLength(500)]
        public string? AttendanceRemarks { get; set; }

        public DateTime Created { get; set; } = DateTime.UtcNow;

        public DateTime Modified { get; set; } = DateTime.UtcNow;
    }
}
