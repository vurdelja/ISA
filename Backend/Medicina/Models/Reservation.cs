using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Medicina.Models
{
    public class Reservation
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int EquipmentId { get; set; }
        public int EquipmentCount { get; set; }
        public bool IsCollected { get; set; }
        public string? Name { get; set; }
        public string? Surname { get; set; }

        public DateTime Deadline { get; set; }
        public int CompanyId { get; set; }
        public Reservation() { }
        public Reservation(int userId, int equipmentId, int count, DateTime date) {
            UserId = userId;
            EquipmentId = equipmentId;
            EquipmentCount = count;
            IsCollected = false;
            Deadline = date;
        }

    }
}
