using System;
using System.Threading.Tasks;
using Medicina.Models;
using Medicina.Context;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Mvc;

namespace Medicina.Services
{
    public class CoordinateGeneratorService : ICoordinateGeneratorService
    {
        private readonly Random _random;
        private readonly EquipmentTrackingContext _equipmentTrackingContext;

        public CoordinateGeneratorService(EquipmentTrackingContext equipmentTrackingContext)
        {
            _random = new Random();
            _equipmentTrackingContext = equipmentTrackingContext;
        }

        public async Task<EquipmentTracking> GenerateCoordinates(int equipmentId)
        {
            try
            {
                // Pronalaženje opreme sa odgovarajućim ID-om iz baze podataka
                var equipment = await _equipmentTrackingContext.EquipmentTracking.FindAsync(equipmentId);

                if (equipment != null)
                {
                    // Dobijanje početnih i krajnjih koordinata iz opreme
                    var startLatitude = equipment.Latitude;
                    var startLongitude = equipment.Longitude;
                    var endLatitude = equipment.LatitudeB;
                    var endLongitude = equipment.LongitudeB;

                    // Generisanje novih koordinata unutar opsega definisanog početnim i krajnjim tačkama
                    double latitude = GenerateRandomCoordinate(startLatitude, endLatitude);
                    double longitude = GenerateRandomCoordinate(startLongitude, endLongitude);

                    // Ažuriranje koordinata opreme u bazi podataka
                    equipment.Latitude = latitude;
                    equipment.Longitude = longitude;
                    equipment.LastUpdateTime = DateTime.Now;

                    await _equipmentTrackingContext.SaveChangesAsync();

                    return equipment;
                }
                else
                {
                    return null;
                }
            }
            catch (Exception ex)
            {
                // Rukovanje greškom
                Console.WriteLine($"Error generating coordinates: {ex.Message}");
                return null;
            }
        }

        private double GenerateRandomCoordinate(double start, double end)
        {
            // Generisanje slučajnog broja između start i end sa korakom 2
            double step = 0.3
                ; // Korak može biti prilagođen vašim potrebama
            return start + (step * Math.Round(_random.NextDouble() * ((end - start) / step)));
        }
    }
}
