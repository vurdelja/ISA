
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Net;
using System.Xml.Linq;

namespace Medicina.Models
{
    public enum AppointmentStatus
    {
        Available,
        Reserved,
        Collected
    }
    public class Appointment
    {
        public int Id { get; set; }
        public int AdministratorsId { get; set; }
        public int CompanyId { get; set; }
        public int? ReservationId { get; set; }        
        public string? AdministratorsName { get; set; }        
        public string? AdministratorsSurname { get; set; }
        public DateTime Start { get; set; }
        public DateTime EndTime { get; set; }
        public int Duration { get; set; }
        public AppointmentStatus Status { get; set; }

        public Appointment()
        {
            Status = AppointmentStatus.Available;
            UpdateEndTime();
        }
        public Appointment(int administratorsId, int companyId, int resId, DateTime date, int duration)
        {
            AdministratorsId = administratorsId;
            CompanyId = companyId;
            ReservationId = resId; 
            Start = date;
            Duration = duration;
            Status = AppointmentStatus.Available;
            UpdateEndTime();
        }

        private void UpdateEndTime()
        {
            EndTime = Start.AddMinutes(Duration);
        }
    }
}
