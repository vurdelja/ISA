using Medicina.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace Medicina.Context
{
    public class PersonContext : DbContext
    {
        public PersonContext(DbContextOptions<PersonContext> options) : base(options)
        {

        }

        public DbSet<Person> Persons { get; set; }
        public Person GetUserWithEmailAndPassword(string email, string password)
        {
            return Persons.Where(x => x.Email == email && x.Password == password).FirstOrDefault();
        }
        public Person GetUserWithActivationLink(string link)
        {
            return Persons.Where(x => x.ActivationLink == link).FirstOrDefault();
        }
    }
}