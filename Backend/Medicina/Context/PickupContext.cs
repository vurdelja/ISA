using Medicina.Models;
using Microsoft.EntityFrameworkCore;

namespace Medicina.Context
{
    public class PickupContext : DbContext
    {
        public PickupContext(DbContextOptions<PickupContext> options) : base(options)
        {
        }

        public DbSet<PickupReservation> Pickups { get; set; }



    }
}
