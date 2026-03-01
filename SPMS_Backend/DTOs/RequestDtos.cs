using System.ComponentModel.DataAnnotations;

namespace SPMS_Backend.DTOs
{
    public class LoginRequestDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string Password { get; set; } = string.Empty;

        [Required]
        public string Role { get; set; } = "faculty"; // admin / faculty / student
    }

    public class LoginResponseDto
    {
        public bool Success { get; set; }
        public string Token { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public int UserId { get; set; }
    }

    public class StaffCreateDto
    {
        [Required]
        public string StaffName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        public string? Phone { get; set; }

        [Required]
        public string Password { get; set; } = string.Empty;

        public string Role { get; set; } = "Faculty";

        public string? Description { get; set; }
    }

    public class StaffUpdateDto
    {
        [Required]
        public string StaffName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        public string? Phone { get; set; }

        public string? Description { get; set; }

        public string Role { get; set; } = "Faculty";
    }

    public class StudentCreateDto
    {
        [Required]
        public string StudentName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        public string? Phone { get; set; }

        [Required]
        public string Password { get; set; } = string.Empty;

        public string? Description { get; set; }

        public double CGPA { get; set; } = 0.0;
    }

    public class StudentUpdateDto
    {
        [Required]
        public string StudentName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        public string? Phone { get; set; }

        public string? Description { get; set; }

        public double CGPA { get; set; } = 0.0;
    }

    public class ProjectTypeCreateDto
    {
        [Required]
        public string ProjectTypeName { get; set; } = string.Empty;

        public string? Description { get; set; }
    }

    public class ProjectGroupCreateDto
    {
        [Required]
        public string ProjectGroupName { get; set; } = string.Empty;

        [Required]
        public int ProjectTypeID { get; set; }

        [Required]
        public int GuideStaffID { get; set; }

        public string? ProjectTitle { get; set; }

        public string? ProjectArea { get; set; }

        public string? ProjectDescription { get; set; }

        public int? ConvenerStaffID { get; set; }

        public int? ExpertStaffID { get; set; }

        public string? Description { get; set; }

        public List<ProjectGroupMemberCreateDto> Members { get; set; } = new();
    }

    public class ProjectGroupMemberCreateDto
    {
        [Required]
        public int StudentID { get; set; }

        public bool IsGroupLeader { get; set; } = false;

        public double StudentCGPA { get; set; } = 0.0;

        public string? Description { get; set; }
    }

    public class ProjectGroupStatusDto
    {
        [Required]
        public string Status { get; set; } = string.Empty; // approved / rejected

        public string? StatusDescription { get; set; }
    }

    public class MeetingCreateDto
    {
        [Required]
        public int ProjectGroupID { get; set; }

        [Required]
        public int GuideStaffID { get; set; }

        [Required]
        public DateTime MeetingDateTime { get; set; }

        [Required]
        public string MeetingPurpose { get; set; } = string.Empty;

        public string? MeetingLocation { get; set; }

        public string? MeetingNotes { get; set; }
    }

    public class MeetingUpdateDto
    {
        public DateTime? MeetingDateTime { get; set; }

        public string? MeetingPurpose { get; set; }

        public string? MeetingLocation { get; set; }

        public string? MeetingNotes { get; set; }

        public string? MeetingStatus { get; set; }

        public string? StatusDescription { get; set; }
    }

    public class AttendanceUpdateDto
    {
        [Required]
        public List<AttendanceItemDto> Attendances { get; set; } = new();
    }

    public class AttendanceItemDto
    {
        [Required]
        public int StudentID { get; set; }

        public bool IsPresent { get; set; } = false;

        public string? AttendanceRemarks { get; set; }
    }
}
