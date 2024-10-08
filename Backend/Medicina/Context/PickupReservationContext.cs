using Medicina.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;

public class PickupReservationContext : DbContext
{
    public PickupReservationContext(DbContextOptions<PickupReservationContext> options)
        : base(options)
    {
    }

    public DbSet<PickupReservation> PickupReservations { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<PickupReservation>()
            .Property(e => e.EquipmentIds)
            .HasConversion(
                v => string.Join(',', v),
                v => v.Split(',', StringSplitOptions.RemoveEmptyEntries).Select(int.Parse).ToList()
            );

        base.OnModelCreating(modelBuilder);
    }
}
