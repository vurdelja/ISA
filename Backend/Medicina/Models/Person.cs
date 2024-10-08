using Microsoft.AspNetCore.Identity;
using System;
using System.ComponentModel.DataAnnotations;

namespace Medicina.Models
{
    public class Person
    {
        [Key]
        public int UserID { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public string City { get; set; }
        public string Country { get; set; }
        public string Phone { get; set; }
        public string Profession { get; set; }
        public string CompanyInfo { get; set; }
        public DateTime MemberSince { get; set; }
        public string ActivationLink { get; set; }
        public bool IsActivated { get; set; }
    }
}
