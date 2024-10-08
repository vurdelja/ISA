using Medicina.Context;
using Medicina.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;


namespace Medicina.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("AllowOrigin")]

    public class CompanyController : ControllerBase
    {
        private readonly IConfiguration _config;
        public readonly CompanyContext _companyContext;
        public readonly EquipmentContext _equipmentContext;
        public readonly UserContext _userContext;

        public CompanyController(IConfiguration config, CompanyContext companyContext, EquipmentContext equipmentContext, UserContext userContext)
        {
            _config = config;
            _companyContext = companyContext;
            _equipmentContext = equipmentContext;
            _userContext = userContext;
        }

        [HttpGet("GetAllCompanies")]
        public ActionResult<IEnumerable<Company>> GetAll()
        {
            var companies = _companyContext.Companies.ToList();

            if (companies == null)
            {
                return NotFound();
            }

            return Ok(companies);
        }
        [HttpGet("GetCompanyById/{id}")]
        public ActionResult<Company> GetCompanyById(int id)
        {
            var company = _companyContext.Companies.Find(id);

            if (company == null)
            {
                return NotFound();
            }

            return Ok(company);
        }

        [HttpGet("GetCompanybyEquipmentId/{id}")]
        public ActionResult<Company> GetCompanybyEquipmentId(int id)
        {
            var company = _companyContext.Companies.Find(id);


            if (company == null)
            {
                return NotFound();
            }

            return Ok(company);
        }

        [HttpPatch("UpdateCompany/{companyId}")]
        public ActionResult<Company> UpdateCompany(int companyId, [FromBody] Company updatedCompany)
        {
            var existingCompany = _companyContext.Companies.Find(companyId);

            if (existingCompany == null)
            {
                return NotFound();
            }

            _companyContext.Entry(existingCompany).CurrentValues.SetValues(updatedCompany);
            _companyContext.SaveChanges();

            return Ok(existingCompany);
        }


        [HttpPost("RegisterCompany/{selectedUserId}")]
        public IActionResult RegisterCompany(Company company, int selectedUserId)
        {
            User user = _userContext.Users.FirstOrDefault(u => u.UserID == selectedUserId);


            if (ModelState.IsValid)
            {
                if (user != null)
                {

                    _companyContext.Add(company);
                    _companyContext.SaveChanges();
                    user.CompanyId = company.Id;
                    _userContext.Users.Update(user);
                    _userContext.SaveChanges();
                    return Ok("Company registered successfully.");
                }
                else
                {
                    return BadRequest("No user with CAMPAIN_ADMIN role found.");
                }
            }
            else
            {
                return BadRequest("Invalid model state. Check your inputs.");
            }
        }
        [HttpGet("GetCompanyByAdminId/{id}")]
        public ActionResult<Company> GetCompanyByAdminId(int id)
        {
            var admin = _userContext.Users.Find(id);

            // Check if the admin user was found
            if (admin == null)
            {
                return NotFound($"User with ID {id} not found.");
            }


            var company = _companyContext.Companies.FirstOrDefault(c=> c.Id == admin.CompanyId);


            if (company == null)
            {
                return NotFound();
            }

            return Ok(company);
        }


    }
}
