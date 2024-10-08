using Medicina.Models;
using Microsoft.EntityFrameworkCore;

namespace Medicina.Context
{
    public class CompanyContext : DbContext
    {
        public CompanyContext(DbContextOptions<CompanyContext> options) : base(options)
        {

        }

        public DbSet<Company> Companies { get; set; } 

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
        }
    }
}
