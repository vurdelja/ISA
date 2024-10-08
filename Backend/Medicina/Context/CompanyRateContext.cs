using Medicina.Models;
using Microsoft.EntityFrameworkCore;
using System.Data;

namespace Medicina.Context
{
    public class CompanyRateContext : DbContext
    {
        public CompanyRateContext(DbContextOptions<CompanyRateContext> options) : base(options)
        {

        }

        public DbSet<CompanyRate> CompanyRates { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
        }
    }
}
