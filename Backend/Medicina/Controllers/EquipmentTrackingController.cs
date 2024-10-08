using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Medicina.Services;
using Medicina.Models;
using System;

namespace Medicina.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EquipmentTrackingController : ControllerBase
    {
        private readonly ICoordinateGeneratorService _coordinateGeneratorService;
        private readonly RabbitMQService _rabbitMQService;

        public EquipmentTrackingController(ICoordinateGeneratorService coordinateGeneratorService, RabbitMQService rabbitMQService)
        {
            _coordinateGeneratorService = coordinateGeneratorService;
            _rabbitMQService = rabbitMQService;
        }

        [HttpPost]
        [Route("sendCoordinates")]
        public async Task<IActionResult> SendCoordinates(int equipmentId)
        {
            try
            {
                // Generisanje novih koordinata
                var equipment = await _coordinateGeneratorService.GenerateCoordinates(equipmentId);

                if (equipment == null)
                {
                    return NotFound($"Equipment with ID {equipmentId} not found.");
                }

                // Kreiranje objekta sa novim koordinatama
                var coordinates = new
                {
                    Latitude = equipment.Latitude,
                    Longitude = equipment.Longitude,
                    LatitudeB = equipment.LatitudeB,
                    LongitudeB = equipment.LongitudeB,
                    LastUpdateTime = equipment.LastUpdateTime
                };

                // Serijalizacija koordinata u JSON format
                var message = JsonConvert.SerializeObject(coordinates);

                // Slanje poruke (koordinata) na RabbitMQ server
                _rabbitMQService.SendMessage("Ovo je poruka koju šaljemo RabbitMQ poslužitelju.");

                _rabbitMQService.SendMessage(message);

                // Vraćanje objekta koji sadrži poruku i koordinate
                return Ok(new
                {
                    message = "Coordinates sent successfully.",
                    latitude = coordinates.Latitude,
                    longitude = coordinates.Longitude,
                    latitudeB = coordinates.LatitudeB,
                    longitudeB= coordinates.LongitudeB,
                    lastUpdateTime = coordinates.LastUpdateTime
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error sending coordinates: {ex.Message}");
            }
        }
    }
}
