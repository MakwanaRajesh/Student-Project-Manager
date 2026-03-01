using Microsoft.EntityFrameworkCore;
using SPMS_Backend.Models;

namespace SPMS_Backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Student> Students { get; set; }
        public DbSet<Staff> Staffs { get; set; }
        public DbSet<ProjectType> ProjectTypes { get; set; }
        public DbSet<ProjectGroup> ProjectGroups { get; set; }
        public DbSet<ProjectGroupMember> ProjectGroupMembers { get; set; }
        public DbSet<ProjectMeeting> ProjectMeetings { get; set; }
        public DbSet<ProjectMeetingAttendance> ProjectMeetingAttendances { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Avoid multiple cascade paths by restricting some foreign keys
            modelBuilder.Entity<ProjectGroup>()
                .HasOne(pg => pg.GuideStaff)
                .WithMany()
                .HasForeignKey(pg => pg.GuideStaffID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<ProjectGroup>()
                .HasOne(pg => pg.ConvenerStaff)
                .WithMany()
                .HasForeignKey(pg => pg.ConvenerStaffID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<ProjectGroup>()
                .HasOne(pg => pg.ExpertStaff)
                .WithMany()
                .HasForeignKey(pg => pg.ExpertStaffID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<ProjectMeeting>()
                .HasOne(pm => pm.GuideStaff)
                .WithMany()
                .HasForeignKey(pm => pm.GuideStaffID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<ProjectGroupMember>()
                .HasOne(m => m.ProjectGroup)
                .WithMany(g => g.Members)
                .HasForeignKey(m => m.ProjectGroupID)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<ProjectMeetingAttendance>()
                .HasOne(a => a.ProjectMeeting)
                .WithMany(m => m.Attendances)
                .HasForeignKey(a => a.ProjectMeetingID)
                .OnDelete(DeleteBehavior.Cascade);

            // Seed default admin
            modelBuilder.Entity<Staff>().HasData(new Staff
            {
                StaffID = 1,
                StaffName = "Admin User",
                Email = "admin@university.edu",
                Phone = "9000000000",
                Password = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
                Role = "Admin",
                Description = "System Administrator",
                Created = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                Modified = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            });

            modelBuilder.Entity<Staff>().HasData(new Staff
            {
                StaffID = 2,
                StaffName = "Dr. Rajesh Kumar",
                Email = "rajesh.kumar@university.edu",
                Phone = "9876543210",
                Password = BCrypt.Net.BCrypt.HashPassword("Faculty@123"),
                Role = "Faculty",
                Description = "Professor - Computer Science",
                Created = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                Modified = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            });

            modelBuilder.Entity<Staff>().HasData(new Staff
            {
                StaffID = 3,
                StaffName = "Dr. Priya Sharma",
                Email = "priya.sharma@university.edu",
                Phone = "9876543211",
                Password = BCrypt.Net.BCrypt.HashPassword("Faculty@123"),
                Role = "Faculty",
                Description = "Associate Professor - AI/ML",
                Created = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                Modified = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            });

            // Seed project types
            modelBuilder.Entity<ProjectType>().HasData(
                new ProjectType { ProjectTypeID = 1, ProjectTypeName = "Major Project", Description = "Final year major project", Created = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc), Modified = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc) },
                new ProjectType { ProjectTypeID = 2, ProjectTypeName = "Mini Project", Description = "Semester mini project", Created = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc), Modified = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc) },
                new ProjectType { ProjectTypeID = 3, ProjectTypeName = "Research Project", Description = "Research and development project", Created = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc), Modified = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc) }
            );

            // Seed students
            modelBuilder.Entity<Student>().HasData(
                new Student { StudentID = 1, StudentName = "Arjun Mehta", Email = "arjun.m@student.edu", Phone = "9123456780", Password = BCrypt.Net.BCrypt.HashPassword("Student@123"), Description = "CSE - 4th Year", CGPA = 8.5, Created = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc), Modified = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc) },
                new Student { StudentID = 2, StudentName = "Sneha Reddy", Email = "sneha.r@student.edu", Phone = "9123456781", Password = BCrypt.Net.BCrypt.HashPassword("Student@123"), Description = "CSE - 4th Year", CGPA = 9.1, Created = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc), Modified = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc) },
                new Student { StudentID = 3, StudentName = "Vikram Singh", Email = "vikram.s@student.edu", Phone = "9123456782", Password = BCrypt.Net.BCrypt.HashPassword("Student@123"), Description = "CSE - 4th Year", CGPA = 8.8, Created = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc), Modified = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc) },
                new Student { StudentID = 4, StudentName = "Ananya Gupta", Email = "ananya.g@student.edu", Phone = "9123456783", Password = BCrypt.Net.BCrypt.HashPassword("Student@123"), Description = "CSE - 4th Year", CGPA = 9.3, Created = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc), Modified = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc) },
                new Student { StudentID = 5, StudentName = "Rohan Joshi", Email = "rohan.j@student.edu", Phone = "9123456784", Password = BCrypt.Net.BCrypt.HashPassword("Student@123"), Description = "CSE - 3rd Year", CGPA = 8.2, Created = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc), Modified = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc) },
                new Student { StudentID = 6, StudentName = "Kavya Nair", Email = "kavya.n@student.edu", Phone = "9123456785", Password = BCrypt.Net.BCrypt.HashPassword("Student@123"), Description = "CSE - 3rd Year", CGPA = 8.9, Created = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc), Modified = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc) }
            );
        }
    }
}
