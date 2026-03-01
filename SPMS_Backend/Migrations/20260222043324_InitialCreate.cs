using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace SPMS_Backend.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "ProjectTypes",
                columns: table => new
                {
                    ProjectTypeID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    ProjectTypeName = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Description = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Created = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    Modified = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProjectTypes", x => x.ProjectTypeID);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Staffs",
                columns: table => new
                {
                    StaffID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    StaffName = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Email = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Phone = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Password = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Role = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Description = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Created = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    Modified = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Staffs", x => x.StaffID);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Students",
                columns: table => new
                {
                    StudentID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    StudentName = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Email = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Phone = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Password = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Description = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CGPA = table.Column<double>(type: "double", nullable: false),
                    Created = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    Modified = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Students", x => x.StudentID);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "ProjectGroups",
                columns: table => new
                {
                    ProjectGroupID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    ProjectGroupName = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ProjectTypeID = table.Column<int>(type: "int", nullable: false),
                    GuideStaffID = table.Column<int>(type: "int", nullable: false),
                    ProjectTitle = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ProjectArea = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ProjectDescription = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    AverageCPI = table.Column<double>(type: "double", nullable: false),
                    ConvenerStaffID = table.Column<int>(type: "int", nullable: true),
                    ExpertStaffID = table.Column<int>(type: "int", nullable: true),
                    Status = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    StatusDescription = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Description = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Created = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    Modified = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProjectGroups", x => x.ProjectGroupID);
                    table.ForeignKey(
                        name: "FK_ProjectGroups_ProjectTypes_ProjectTypeID",
                        column: x => x.ProjectTypeID,
                        principalTable: "ProjectTypes",
                        principalColumn: "ProjectTypeID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ProjectGroups_Staffs_ConvenerStaffID",
                        column: x => x.ConvenerStaffID,
                        principalTable: "Staffs",
                        principalColumn: "StaffID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ProjectGroups_Staffs_ExpertStaffID",
                        column: x => x.ExpertStaffID,
                        principalTable: "Staffs",
                        principalColumn: "StaffID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ProjectGroups_Staffs_GuideStaffID",
                        column: x => x.GuideStaffID,
                        principalTable: "Staffs",
                        principalColumn: "StaffID",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "ProjectGroupMembers",
                columns: table => new
                {
                    ProjectGroupMemberID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    ProjectGroupID = table.Column<int>(type: "int", nullable: false),
                    StudentID = table.Column<int>(type: "int", nullable: false),
                    IsGroupLeader = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    StudentCGPA = table.Column<double>(type: "double", nullable: false),
                    Description = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Created = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    Modified = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProjectGroupMembers", x => x.ProjectGroupMemberID);
                    table.ForeignKey(
                        name: "FK_ProjectGroupMembers_ProjectGroups_ProjectGroupID",
                        column: x => x.ProjectGroupID,
                        principalTable: "ProjectGroups",
                        principalColumn: "ProjectGroupID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ProjectGroupMembers_Students_StudentID",
                        column: x => x.StudentID,
                        principalTable: "Students",
                        principalColumn: "StudentID",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "ProjectMeetings",
                columns: table => new
                {
                    ProjectMeetingID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    ProjectGroupID = table.Column<int>(type: "int", nullable: false),
                    GuideStaffID = table.Column<int>(type: "int", nullable: false),
                    MeetingDateTime = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    MeetingPurpose = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    MeetingLocation = table.Column<string>(type: "varchar(300)", maxLength: 300, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    MeetingNotes = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    MeetingStatus = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    StatusDescription = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Created = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    Modified = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProjectMeetings", x => x.ProjectMeetingID);
                    table.ForeignKey(
                        name: "FK_ProjectMeetings_ProjectGroups_ProjectGroupID",
                        column: x => x.ProjectGroupID,
                        principalTable: "ProjectGroups",
                        principalColumn: "ProjectGroupID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ProjectMeetings_Staffs_GuideStaffID",
                        column: x => x.GuideStaffID,
                        principalTable: "Staffs",
                        principalColumn: "StaffID",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "ProjectMeetingAttendances",
                columns: table => new
                {
                    ProjectMeetingAttendanceID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    ProjectMeetingID = table.Column<int>(type: "int", nullable: false),
                    StudentID = table.Column<int>(type: "int", nullable: false),
                    IsPresent = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    AttendanceRemarks = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Created = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    Modified = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProjectMeetingAttendances", x => x.ProjectMeetingAttendanceID);
                    table.ForeignKey(
                        name: "FK_ProjectMeetingAttendances_ProjectMeetings_ProjectMeetingID",
                        column: x => x.ProjectMeetingID,
                        principalTable: "ProjectMeetings",
                        principalColumn: "ProjectMeetingID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ProjectMeetingAttendances_Students_StudentID",
                        column: x => x.StudentID,
                        principalTable: "Students",
                        principalColumn: "StudentID",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.InsertData(
                table: "ProjectTypes",
                columns: new[] { "ProjectTypeID", "Created", "Description", "Modified", "ProjectTypeName" },
                values: new object[,]
                {
                    { 1, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Final year major project", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Major Project" },
                    { 2, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Semester mini project", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Mini Project" },
                    { 3, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Research and development project", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Research Project" }
                });

            migrationBuilder.InsertData(
                table: "Staffs",
                columns: new[] { "StaffID", "Created", "Description", "Email", "Modified", "Password", "Phone", "Role", "StaffName" },
                values: new object[,]
                {
                    { 1, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "System Administrator", "admin@university.edu", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "$2a$11$airwSniyUxb0sjl7AyXP1O/Qk1KxZR0kWl9o6hUiAhjvtACZ1WFk2", "9000000000", "Admin", "Admin User" },
                    { 2, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Professor - Computer Science", "rajesh.kumar@university.edu", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "$2a$11$COOaUMgbp/RgYVV7xGB1huDnDM2./zY4YWRKdVhyRWgbJX6L1H5nW", "9876543210", "Faculty", "Dr. Rajesh Kumar" },
                    { 3, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Associate Professor - AI/ML", "priya.sharma@university.edu", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "$2a$11$ZpCqjArPwXdM/JlZV7KgNOOkNbik2XBTq8j7PXwuKshOULflvnXDm", "9876543211", "Faculty", "Dr. Priya Sharma" }
                });

            migrationBuilder.InsertData(
                table: "Students",
                columns: new[] { "StudentID", "CGPA", "Created", "Description", "Email", "Modified", "Password", "Phone", "StudentName" },
                values: new object[,]
                {
                    { 1, 8.5, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "CSE - 4th Year", "arjun.m@student.edu", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "$2a$11$CWyyveP7Jy8Zkup24N4gSO9c8h/Ny8LwqojDTzsinyFcsT6IPlgy.", "9123456780", "Arjun Mehta" },
                    { 2, 9.0999999999999996, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "CSE - 4th Year", "sneha.r@student.edu", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "$2a$11$jYvoqYVATSy4pFXdxn4WtedXLytg95oQXm0aps8Wks3VADRN3rK8e", "9123456781", "Sneha Reddy" },
                    { 3, 8.8000000000000007, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "CSE - 4th Year", "vikram.s@student.edu", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "$2a$11$yKgpijlKWrr29OkwpioMcO2kjR2BTRqNVOjUMaWwcOGBKAEIl4zWe", "9123456782", "Vikram Singh" },
                    { 4, 9.3000000000000007, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "CSE - 4th Year", "ananya.g@student.edu", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "$2a$11$fQEK6vKg6Lndr/hhJPH63OD7kLDvIFFimWIEWqpp69biNlyI3MmC6", "9123456783", "Ananya Gupta" },
                    { 5, 8.1999999999999993, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "CSE - 3rd Year", "rohan.j@student.edu", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "$2a$11$BU92mm8qbFg4V2WPF/LI9Oh1M0rpKXf0PHSz2LTZSYNO0.mSBtyJ6", "9123456784", "Rohan Joshi" },
                    { 6, 8.9000000000000004, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "CSE - 3rd Year", "kavya.n@student.edu", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "$2a$11$ZZ.zGhrw40E73nEVKoUJieNETO6vihKmmRmhbYBnIPtoWvyrcnd9K", "9123456785", "Kavya Nair" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_ProjectGroupMembers_ProjectGroupID",
                table: "ProjectGroupMembers",
                column: "ProjectGroupID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectGroupMembers_StudentID",
                table: "ProjectGroupMembers",
                column: "StudentID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectGroups_ConvenerStaffID",
                table: "ProjectGroups",
                column: "ConvenerStaffID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectGroups_ExpertStaffID",
                table: "ProjectGroups",
                column: "ExpertStaffID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectGroups_GuideStaffID",
                table: "ProjectGroups",
                column: "GuideStaffID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectGroups_ProjectTypeID",
                table: "ProjectGroups",
                column: "ProjectTypeID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectMeetingAttendances_ProjectMeetingID",
                table: "ProjectMeetingAttendances",
                column: "ProjectMeetingID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectMeetingAttendances_StudentID",
                table: "ProjectMeetingAttendances",
                column: "StudentID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectMeetings_GuideStaffID",
                table: "ProjectMeetings",
                column: "GuideStaffID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectMeetings_ProjectGroupID",
                table: "ProjectMeetings",
                column: "ProjectGroupID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ProjectGroupMembers");

            migrationBuilder.DropTable(
                name: "ProjectMeetingAttendances");

            migrationBuilder.DropTable(
                name: "ProjectMeetings");

            migrationBuilder.DropTable(
                name: "Students");

            migrationBuilder.DropTable(
                name: "ProjectGroups");

            migrationBuilder.DropTable(
                name: "ProjectTypes");

            migrationBuilder.DropTable(
                name: "Staffs");
        }
    }
}
