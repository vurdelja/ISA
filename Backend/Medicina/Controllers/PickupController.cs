using Medicina.Context;
using Medicina.Models;
using Microsoft.AspNetCore.Mvc;
using System.Linq;

namespace Medicina.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class PickupController : ControllerBase
    {
        private readonly PickupContext _context;

        public PickupController(PickupContext context)
        {
            _context = context;
        }
/*
        // GET: api/pickup
        [HttpGet]
        public IActionResult GetPickups(string sortBy = "date")
        {
            IQueryable<Pickup> query = _context.Pickups;

            switch (sortBy.ToLower())
            {
                case "equipmentname":
                    query = query.OrderBy(p => p.EquipmentName);
                    break;
                case "companyname":
                    query = query.OrderBy(p => p.CompanyName);
                    break;
                case "date":
                    query = query.OrderBy(p => p.Date);
                    break;
                case "price":
                    query = query.OrderBy(p => p.Price);
                    break;
                case "duration":
                    query = query.OrderBy(p => p.Duration);
                    break;
                default:
                    return BadRequest("Invalid sort parameter. Please use 'equipmentname', 'companyname', 'date', 'price', or 'duration'.");
            }

            return Ok(query.ToList());
        }*/

          [HttpGet("GetUncollectedReservationsByUser/{userId}")]
        public IActionResult GetUncollectedReservationsByUser(int userId)
        {
            var reservations = _context.Pickups
                .Where(r => r.UserId == userId && !r.IsCollected)
                .ToList();

            return Ok(reservations);
        }


        [HttpPatch("CancelReservation/{id}")]
        public IActionResult CancelReservation(int id)
        {
            var reservation = _context.Pickups.Find(id);
            if (reservation == null)
            {
                return NotFound();
            }

            _context.Pickups.Remove(reservation);
            _context.SaveChanges();

            return NoContent();
        }
    }
}

