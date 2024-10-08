using System.Collections.Generic;
using System;

namespace Medicina.Models
{
    public class PickupReservation
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public List<int> EquipmentIds { get; set; }  // Store equipment IDs instead of full objects
        public bool IsCollected { get; set; }
        public int CompanyId { get; set; }
        public DateTime AppointmentDate { get; set; }
        public int AppointmentDuration { get; set; }
        public DateTime AppointmentTime { get; set; }
    }


}
