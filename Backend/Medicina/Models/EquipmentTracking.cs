using System;

namespace Medicina.Models
{
    public class EquipmentTracking
    {
        public int Id { get; set; }
        public int EquipmentId { get; set; } // ID opreme
        public double Latitude { get; set; } // Geografska širina
        public double Longitude { get; set; } // Geografska dužina
        public double LatitudeB { get; set; } // Geografska širina
        public double LongitudeB { get; set; } // Geografska dužina
        public DateTime LastUpdateTime { get; set; } // Vreme poslednjeg ažuriranja

        public EquipmentTracking()
        {
            // Inicijalizacija vrednosti
            LastUpdateTime = DateTime.Now;
        }

        public EquipmentTracking(int equipmentId, double latitude, double longitude,double lattitudeB,double longitudeB)
        {
            EquipmentId = equipmentId;
            Latitude = latitude;
            Longitude = longitude;
            LastUpdateTime = DateTime.Now;
            LatitudeB = lattitudeB;
            LongitudeB = longitudeB;
        }
    }
}
