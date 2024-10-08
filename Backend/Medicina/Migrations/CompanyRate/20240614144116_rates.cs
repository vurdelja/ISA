using Microsoft.EntityFrameworkCore.Migrations;

namespace Medicina.Migrations.CompanyRate
{
    public partial class rates : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "CompanyRates",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Rate = table.Column<double>(nullable: false),
                    HighQuality = table.Column<bool>(nullable: false),
                    LowQuality = table.Column<bool>(nullable: false),
                    Cheap = table.Column<bool>(nullable: false),
                    Expensive = table.Column<bool>(nullable: false),
                    WideSelection = table.Column<bool>(nullable: false),
                    LimitedSelection = table.Column<bool>(nullable: false),
                    Description = table.Column<string>(nullable: true),
                    CompanyId = table.Column<int>(nullable: false),
                    UserId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CompanyRates", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CompanyRates");
        }
    }
}
