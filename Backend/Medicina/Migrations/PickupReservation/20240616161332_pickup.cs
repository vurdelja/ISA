using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Medicina.Migrations.PickupReservation
{
    public partial class pickup : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "PickupReservations",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(nullable: false),
                    EquipmentIds = table.Column<string>(nullable: true),
                    IsCollected = table.Column<bool>(nullable: false),
                    CompanyId = table.Column<int>(nullable: false),
                    AppointmentDate = table.Column<DateTime>(nullable: false),
                    AppointmentDuration = table.Column<int>(nullable: false),
                    AppointmentTime = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PickupReservations", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PickupReservations");
        }
    }
}
