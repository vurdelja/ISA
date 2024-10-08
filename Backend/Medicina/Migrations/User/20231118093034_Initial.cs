using Microsoft.EntityFrameworkCore.Migrations;
using System;

namespace Medicina.Migrations.User
{
    public partial class Initial : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {


            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    UserID = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserRole = table.Column<Enum>(nullable: false),
                    Password = table.Column<string>(nullable: true),
                    Name = table.Column<string>(nullable: true),
                    Surname = table.Column<string>(nullable: true),

                },
                constraints: table =>
              {
                  table.PrimaryKey("PK_Users", x => x.UserID);
              }); ;

        }




        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
              name: "Users");
        }
      
    }
}
