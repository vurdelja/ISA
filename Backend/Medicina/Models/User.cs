using System;

namespace Medicina.Models
{
    public enum Role { REGISTER_USER, CAMPAIN_ADMIN, SYSTEM_ADMIN, UNAUTHENTICAN_USER }

    public class User
    {
        public int UserID { get; set; }
        public string Email {  get; set; }
        public string Password { get; set; }
        public Role UserRole { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public int CompanyId { get; set; }
        public bool IsPredef {  get; set; }
        public int PenaltyScore { get; set; }
    }
}
