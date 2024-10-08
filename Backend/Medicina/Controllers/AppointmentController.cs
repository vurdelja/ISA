using Medicina.Context;
using Medicina.Models;
using Medicina.Service;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using SendGrid.Helpers.Mail;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Medicina.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("AllowOrigin")]
    public class AppointmentController : ControllerBase
    {
        public readonly AppointmentContext _appointmentContext;
        public readonly EquipmentContext _equipmentContext;
        public readonly CompanyContext _companyContext;
        public readonly PickupReservationContext _reservationContext;
        public readonly UserContext _userContext;
        public readonly PersonContext _presonContext;
        private readonly IOptions<Medicina.MailUtil.MailSettings> _mailSettingsOptions;

        public AppointmentController(IOptions<Medicina.MailUtil.MailSettings> mailSettingsOptions, AppointmentContext appointmentContext, EquipmentContext equipmentContext, CompanyContext companyContext, PickupReservationContext reservationContext, UserContext userContext, PersonContext personContext)
        {
            _appointmentContext = appointmentContext;
            _equipmentContext = equipmentContext;
            _companyContext = companyContext;
            _reservationContext = reservationContext;
            _userContext = userContext;
            _presonContext = personContext;
            _mailSettingsOptions = mailSettingsOptions;
        }

        [HttpGet("GetAppointmentsByCompanyId/{id}")]
        public ActionResult<IEnumerable<Appointment>> GetAppointmentsByCompanyId(int id)
        {
            var appointmentList = _appointmentContext.Appointments
                .Where(e => e.CompanyId == id && e.Status == AppointmentStatus.Available)
                .ToList();

            if (appointmentList == null || appointmentList.Count == 0)
            {
                return NotFound();
            }
            return Ok(appointmentList);
        }

        [HttpGet("GetAllAppointments")]
        public ActionResult<IEnumerable<Appointment>> GetAll()
        {
            var appointments = _appointmentContext.Appointments.ToList();

            if (appointments == null || appointments.Count == 0)
            {
                return NotFound();
            }

            return Ok(appointments);
        }

        [HttpGet("GetAppointmentsByDateAndWorking/{id}/{date}")]
        public ActionResult<IEnumerable<Appointment>> GetAppointmentsByDateAndWorking(int id, DateTime date)
        {
            // Filter appointments for a specific date
            var appointmentList = _appointmentContext.Appointments
                .Where(e => e.CompanyId == id && e.Start.Date == date.Date)
                .ToList();

            if (appointmentList == null || appointmentList.Count == 0)
            {
                return NotFound();
            }

            return Ok(appointmentList);
        }

        [HttpPost("AddAppointment")]
        public ActionResult<Appointment> AddAppointment([FromBody] Appointment newAppointment)
        {
            if (newAppointment == null)
            {
                return BadRequest();
            }

            var admin = _presonContext.Persons.Find(newAppointment.AdministratorsId);
            var company = _companyContext.Companies.FirstOrDefault(e => e.Id == newAppointment.CompanyId);
            newAppointment.AdministratorsName = admin.Name;
            newAppointment.AdministratorsSurname = admin.Surname;

            newAppointment.Status = AppointmentStatus.Available;
            newAppointment.EndTime = newAppointment.Start.AddMinutes(newAppointment.Duration);
            TimeSpan startTimeOfDay = new TimeSpan(newAppointment.Start.TimeOfDay.Hours, newAppointment.Start.TimeOfDay.Minutes, newAppointment.Start.TimeOfDay.Seconds);
            TimeSpan endTimeOfDay = new TimeSpan(newAppointment.EndTime.TimeOfDay.Hours, newAppointment.EndTime.TimeOfDay.Minutes, newAppointment.EndTime.TimeOfDay.Seconds);

            if (startTimeOfDay < company.OpeningTime || endTimeOfDay > company.ClosingTime)
            {
                return BadRequest("Appointment is outside of working hours.");
            }

            var adminsAppointments = _appointmentContext.Appointments
                .Where(e => e.AdministratorsId == admin.UserID)
                .ToList();
            var allAppointments = _appointmentContext.Appointments.ToList();

            foreach (var app in allAppointments)
            {
                if ((app.Start <= newAppointment.Start && app.EndTime >= newAppointment.EndTime) ||
                    (app.Start >= newAppointment.Start && app.EndTime <= newAppointment.EndTime) ||
                    (app.Start < newAppointment.EndTime && app.EndTime > newAppointment.Start))
                {
                    return BadRequest("Appointment conflicts with another appointment.");
                }
            }

            _appointmentContext.Appointments.Add(newAppointment);
            _appointmentContext.SaveChanges();
            _companyContext.SaveChanges();

            return CreatedAtAction(nameof(GetAppointmentsByCompanyId), new { id = newAppointment.CompanyId }, newAppointment);
        }



        [HttpGet("GetAppointmentsForDay")]
        public ActionResult<IEnumerable<object>> GetAppointmentsForDay([FromQuery] DateTime date)
        {
            var appointmentsForDay = _appointmentContext.Appointments
                .Where(a => a.Start.Date == date.Date)
                .ToList();

            return Ok(appointmentsForDay);
        }



        [HttpPost("pickup-reservations")]
        public async Task<ActionResult<PickupReservation>> CreatePickupReservation([FromBody] PickupReservation newReservation)
        {
            if (newReservation == null || newReservation.EquipmentIds == null || !newReservation.EquipmentIds.Any())
            {
                return BadRequest("Invalid reservation data.");
            }

            newReservation.IsCollected = false;
            _reservationContext.PickupReservations.Add(newReservation);
            await _reservationContext.SaveChangesAsync();

            // Generate QR code with reservation details
            //var reservationDetails = $"Reservation ID: {newReservation.Id}\nUser ID: {newReservation.UserId}\nCompany ID: {newReservation.CompanyId}\nAppointment Date: {newReservation.AppointmentDate}\nAppointment Time: {newReservation.AppointmentTime}";

            // Generate QR code with reservation details
            var reservationDetails = new PickupReservation
            {
                Id = newReservation.Id,
                UserId = newReservation.UserId,
                CompanyId = newReservation.CompanyId,
                AppointmentDate = newReservation.AppointmentDate,
                AppointmentTime = newReservation.AppointmentTime,
                EquipmentIds = newReservation.EquipmentIds // Assuming EquipmentIds are used to represent the list
            };

            var qrCodeService = new QRCodeService();
            byte[] qrCodeBytes = qrCodeService.GenerateQrCode(reservationDetails);


            // Send email with QR code
            var user = await _userContext.Users.FindAsync(newReservation.UserId);
            if (user != null)
            {
                var email = user.Email;
                var subject = "Reservation Confirmation";
                var message = $"Your reservation has been confirmed. Details:\n{reservationDetails}";

                EmailService emailService = new EmailService(_mailSettingsOptions);
                string body = "You have successfully reserved an appointment. Here is your QR code.";

                await emailService.SendEmailWithQrCodeAsync(email, subject, body, reservationDetails);
            }

            return CreatedAtAction(nameof(GetPickupReservation), new { id = newReservation.Id }, newReservation);
        }

        [HttpGet("pickup-reservations/{id}")]
        public ActionResult<PickupReservation> GetPickupReservation(int id)
        {
            var reservation = _reservationContext.PickupReservations.Find(id);

            if (reservation == null)
            {
                return NotFound();
            }

            return Ok(reservation);
        }

        [HttpGet("GetExtraordinaryAppointments/{companyId}")]
        public ActionResult<IEnumerable<Appointment>> GetExtraordinaryAppointments(int companyId, [FromQuery] DateTime date)
        {
            var company = _companyContext.Companies.Find(companyId);
            if (company == null)
            {
                return NotFound("Company not found");
            }

            var openingTime = date.Date + company.OpeningTime;
            var closingTime = date.Date + company.ClosingTime;

            var regularAppointments = _appointmentContext.Appointments
                .Where(a => a.CompanyId == companyId && a.Start.Date == date.Date)
                .ToList();

            var extraordinaryAppointments = new List<Appointment>();
            var currentTime = openingTime;

            while (currentTime < closingTime)
            {
                if (!regularAppointments.Any(a => a.Start <= currentTime && a.EndTime > currentTime))
                {
                    extraordinaryAppointments.Add(new Appointment
                    {
                        Start = currentTime,
                        EndTime = currentTime.AddHours(1),
                        CompanyId = companyId,
                        Status = AppointmentStatus.Available
                    });
                }
                currentTime = currentTime.AddHours(1);
            }

            return Ok(extraordinaryAppointments);
        }
    }
}