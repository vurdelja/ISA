using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Medicina.Migrations.Appointment
{
    public partial class appoi : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Appointments",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AdministratorsId = table.Column<int>(nullable: false),
                    CompanyId = table.Column<int>(nullable: false),
                    ReservationId = table.Column<int>(nullable: true),
                    AdministratorsName = table.Column<string>(nullable: true),
                    AdministratorsSurname = table.Column<string>(nullable: true),
                    Start = table.Column<DateTime>(nullable: false),
                    EndTime = table.Column<DateTime>(nullable: false),
                    Duration = table.Column<int>(nullable: false),
                    Status = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Appointments", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Appointments");
        }
    }
}
