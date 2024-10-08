using Medicina.Context;
using Medicina.Models;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Medicina.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("AllowOrigin")]
    public class ReservationController : ControllerBase
    {
        public readonly AppointmentContext _appointmentContext;
        public readonly EquipmentContext _equipmentContext;
        public readonly CompanyContext _companyContext;
        public readonly ReservationContext _reservationContext;
        public readonly UserContext _userContext;
        public ReservationController(AppointmentContext appointmentContext, EquipmentContext equipmentContext, CompanyContext companyContext, ReservationContext reservationContext, UserContext userContext)
        {
            _appointmentContext = appointmentContext;
            _equipmentContext = equipmentContext;
            _companyContext = companyContext;
            _reservationContext = reservationContext;
            _userContext = userContext;
        }

        [HttpGet("HasReservation/{userId}/{companyId}")]
        public IActionResult HasReservation(int userId, int companyId)
        {
            var hasReservation = _reservationContext.Reservations
                .Any(r => r.UserId == userId && r.CompanyId == companyId); // Adjust this line based on your actual data model

            return Ok(hasReservation);
        }

        [HttpGet("GetAllReservations")]
        public ActionResult<IEnumerable<Reservation>> GetAll()
        {
            var reservations = _reservationContext.Reservations.ToList();

            if (reservations == null)
            {
                return NotFound();
            }

            return Ok(reservations);
        }



        [HttpPatch("MakeReservation/{id}")]
        public IActionResult MakeReservation(int id, [FromBody] Reservation reservation)
        {
            if (id == 0)
            {
                // This is a new reservation
                _reservationContext.Reservations.Add(reservation);
            }
            else
            {
                // Update an existing reservation
                var existingReservation = _reservationContext.Reservations.FirstOrDefault(r => r.Id == id);
                if (existingReservation == null)
                {
                    return NotFound();
                }
                // Update fields of existingReservation with data from 'reservation'
                existingReservation.EquipmentId = reservation.EquipmentId;
                existingReservation.EquipmentCount = reservation.EquipmentCount;
                existingReservation.IsCollected = reservation.IsCollected;
                // Add other fields as necessary
            }

            _reservationContext.SaveChanges();
            return Ok();
        }



    }
}