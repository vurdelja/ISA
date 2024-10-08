using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Medicina.Models
{
    public class Company
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }
        public string Description { get; set; }
        public double AverageRating { get; set; }
        [NotMapped]
        public List<Appointment> AvailableAppointments { get; set; } 
        public List<User> OtherAdministrators { get; set; }
        [NotMapped]
        public List<Equipment> CompaniesEquipment { get; set; }
        [NotMapped]
        public Equipment? Equipment { get; set; }
        public int? EquipmentId { get; set; }

        [JsonConverter(typeof(TimeSpanToStringConverter))]
        public TimeSpan OpeningTime { get; set; }

        [JsonConverter(typeof(TimeSpanToStringConverter))]
        public TimeSpan ClosingTime { get; set; }
        public Company()
        {
        }

        public Company(string name, string address, string description, double averageRating, TimeSpan ot, TimeSpan ct)
        {
            Name = name;
            Address = address;
            Description = description;
            AverageRating = averageRating;
            OpeningTime = ot;
            ClosingTime = ct;
        }


        public Company(string name, string address, string description, double averageRating,
            List<Appointment> availablePickupDates, List<User> otherAdministrators,
            List<Equipment> equipmentCompanies, TimeSpan ot, TimeSpan ct)
        {
            Name = name;
            Address = address;
            Description = description;
            AverageRating = averageRating;
            AvailableAppointments = availablePickupDates;
            OtherAdministrators = otherAdministrators;
            CompaniesEquipment = equipmentCompanies;
            OpeningTime = ot;
            ClosingTime = ct;
        }

    }
}