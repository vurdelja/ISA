using Medicina.Models;
using Microsoft.EntityFrameworkCore;

namespace Medicina.Context
{
    public class EquipmentTrackingContext : DbContext
    {
        public EquipmentTrackingContext(DbContextOptions<EquipmentTrackingContext> options) : base(options)
        {

        }

        public DbSet<EquipmentTracking> EquipmentTracking { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
        }
    }
}
