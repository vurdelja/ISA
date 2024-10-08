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
    public class EquipmentController : ControllerBase
    {
        private readonly IConfiguration _config;
        public readonly EquipmentContext _equipmentContext;
        public readonly CompanyContext _companyContext;
        public readonly AppointmentContext _appointmentContext;

        public EquipmentController(IConfiguration config, EquipmentContext equipmentContext, CompanyContext companyContext, AppointmentContext appointmentContext)
        {
            _config = config;
            _appointmentContext = appointmentContext;
            _equipmentContext = equipmentContext;
            _companyContext = companyContext;
        }      

        [HttpGet("GetAllEquipments")]
        public ActionResult<IEnumerable<Equipment>> GetAll()
        {
            var equipments = _equipmentContext.Equipment.ToList();

            if (equipments == null)
            {
                return NotFound();
            }

            return Ok(equipments);
        }

        [HttpGet("GetCompanyEquipmentById/{id}")]
        public ActionResult<Company> GetCompanyEquipmentById(int id)
        {
            var equipmentList = _equipmentContext.Equipment.Where(e => e.CompanyId == id).ToList();
             
            if (equipmentList == null)
            {
                return NotFound();
            }

            return Ok(equipmentList);
        }

        [HttpPost("AddEquipment")] 
        public ActionResult<Equipment> AddEquipment([FromBody] Equipment newEquipment)
        {
            if (newEquipment == null)
            {
                return BadRequest();
            }

            _equipmentContext.Equipment.Add(newEquipment);
            _equipmentContext.SaveChanges();

            return Ok(newEquipment);
        }

        [HttpPatch("EditEquipment/{id}")]
        public IActionResult EditEquipment(int id, [FromBody] Equipment newEquipment)
        {
            var eq = _equipmentContext.Equipment.Find(id);

            if (eq == null)
            {
                return NotFound();
            }
             
            eq.Id = id;
            eq.Name = newEquipment.Name;
            eq.Type = newEquipment.Type;
            eq.Description = newEquipment.Description;
            eq.Rating = newEquipment.Rating;
            eq.Count = newEquipment.Count;
              
            _equipmentContext.Update(eq);
            _equipmentContext.SaveChanges();

            return Ok(eq);
        }
        [HttpDelete("DeleteEquipment/{id}")]
        public IActionResult DeleteEquipment(int id)
        {
            var equipment = _equipmentContext.Equipment.Find(id);

            if (equipment == null)
            {
                return NotFound();
            }

            _equipmentContext.Equipment.Remove(equipment);
            _equipmentContext.SaveChanges();

            return Ok(equipment);
        }
    }
}
