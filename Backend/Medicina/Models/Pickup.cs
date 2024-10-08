using System;

namespace Medicina.Models
{
    public class Pickup
    {
        public int PickupId { get; set; }  // Primary Key
        public string EquipmentName { get; set; }
        public string CompanyName { get; set; }
        public DateTime Date { get; set; }
        public decimal Price { get; set; }
        public TimeSpan Duration { get; set; }
    }
}
