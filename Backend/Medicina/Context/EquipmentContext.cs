using Medicina.Models;
using Microsoft.EntityFrameworkCore;

namespace Medicina.Context
{
    public class EquipmentContext : DbContext
    {
        public EquipmentContext(DbContextOptions<EquipmentContext> options) : base(options)
        {

        }

        public DbSet<Equipment> Equipment { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
        }
    }
}
