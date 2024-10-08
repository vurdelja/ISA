using Medicina.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;

namespace Medicina.Context
{
    public class UserContext : DbContext
    {
        public UserContext(DbContextOptions<UserContext> options) : base(options)
        {

        }

        public DbSet<User> Users { get; set; }

        public List<User> GetUsersByRole(Role role)
        {
            return Users.Where(u => u.UserRole ==Role.CAMPAIN_ADMIN).ToList();
        }
        public User GetUserById(int id)
        {
            return Users.FirstOrDefault(u => u.UserID == id);
        }
    }
}
