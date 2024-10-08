using Medicina.Context;
using Medicina.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
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
    public class UserController : ControllerBase
    {
        private readonly IConfiguration _config;
        public readonly UserContext _userContext;
        public readonly PersonContext _personContext;
        public readonly ReservationContext _resContext;
        public readonly AppointmentContext _appContext;
     
        public UserController(IConfiguration config, UserContext userContext, PersonContext personContext, ReservationContext resContext, AppointmentContext appContext)
        {
            _config = config;
            _userContext = userContext;
            _personContext = personContext;
            _resContext = resContext;
            _appContext = appContext;
        }
        [AllowAnonymous]
        [HttpPost("CreateUser")]
        public IActionResult Create(User user)
        {
            if (_userContext.Users.Where(u => u.Email == user.Email).FirstOrDefault() != null)
            {
                return Ok("Already Exists");
            }

            _userContext.Add(user);
            _userContext.SaveChanges();
          
            return Ok("Succes from Create Method");
        }

 
        [HttpGet("GetUsersByRole")]
        public IActionResult GetUsersByRole()
        {
            var users = _userContext.GetUsersByRole(Role.CAMPAIN_ADMIN);
            return Ok(users);
        }

        [HttpGet("GetUserById/{id}")]
        public IActionResult GetUserById(int id)
        {
            var user = _userContext.GetUserById(id);
            return Ok(user);
        }

        [HttpGet("GetAllSysAdmin")]
        public ActionResult<IEnumerable<User>> GetAll()
        {
            var users = _userContext.Users.ToList().Where(u => u.UserRole==Role.SYSTEM_ADMIN);

            if (users == null)
            {
                return NotFound();
            }

            return Ok(users);
        }

        [HttpGet("GetPersonByUserId/{userId}")]
        public ActionResult<Person> GetPersonByUserId(int userId)
        {
            var user = _userContext.Users.Find(userId);
            if (user == null)
            {
                return NotFound("User not found");
            }

            var person = _personContext.Persons.FirstOrDefault(p => p.Email == user.Email);
            if (person == null)
            {
                return NotFound("Person not found");
            }

            return Ok(person);
        }


        [HttpPost("CreateSystemAdmin")]
        public IActionResult CreateSA([FromBody] User user)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid input data");
            }

            var existingUser = _userContext.Users.FirstOrDefault(u => u.Email == user.Email);

            if (existingUser != null)
            {
                return Ok(new { Success = false, Message = "User with the same email already exists" });
            }
            user.IsPredef = false;
            user.UserRole = Role.SYSTEM_ADMIN;
            _userContext.Add(user);
            _userContext.SaveChanges();

            return Ok(new { Success = true, Message = "User created successfully", UserID = user.UserID });
        }

        [HttpGet("GetAllOtherCompanyAdmins/{userId}/{companyId}")]
        public ActionResult<IEnumerable<User>> GetAllOtherCompanyAdmins(int userId, int companyId)
        {
            var users = _userContext.Users.ToList().Where(u => u.UserRole == Role.CAMPAIN_ADMIN && u.UserID!=userId && u.CompanyId==companyId);

            if (users == null)
            {
                return NotFound();
            }

            return Ok(users);
        }

        [HttpGet("GetUsersWhoReserved/{companyId}")]
        public ActionResult<IEnumerable<User>> GetUsersWhoReserved(int companyId)
        {
            var reservations = _resContext.Reservations.ToList();
            var appointments = _appContext.Appointments
                .Where(u => u.CompanyId == companyId && u.ReservationId != 0 && u.Status == AppointmentStatus.Reserved).ToList();
            var users = new List<User>();
            foreach(var res in reservations)
            {
                var app = _appContext.Appointments.FirstOrDefault(u => u.ReservationId == res.Id);
                if (appointments.Contains(app))
                {
                    var user = _userContext.Users.FirstOrDefault(u => u.UserID == res.UserId && u.UserRole == Role.REGISTER_USER);
                    users.Add(user);
                }               
            }

            if (users == null)
            {
                return NotFound();
            }

            return Ok(users);
        }
    }

}








     
