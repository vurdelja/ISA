using Medicina.Context;
using Medicina.Models;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using System.Linq;

namespace Medicina.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("AllowOrigin")]
    public class CompanyRateController : ControllerBase
    {
        private readonly IConfiguration _config;
        public readonly CompanyRateContext _companyrateContext;
        public readonly CompanyContext _companyContext;
        public readonly ReservationContext _reservationContext;
        public readonly EquipmentContext _equipmentContext;

        public CompanyRateController(IConfiguration config, CompanyRateContext companyrateContext, CompanyContext companyContext)
        {
            _config = config;
            _companyrateContext = companyrateContext;
            _companyContext = companyContext;
        }



        // Update the API method to include userId in fetching rates
        [HttpGet("GetCompanyRateById/{companyId}/{userId}")]
        public ActionResult<IEnumerable<CompanyRate>> GetCompanyRateById(int companyId, int userId)
        {
            var rateList = _companyrateContext.CompanyRates
                .Where(e => e.CompanyId == companyId && e.UserId == userId)
                .ToList();

            if (!rateList.Any())
            {
                return NotFound();
            }

            return Ok(rateList);
        }

        // Update the API method to ensure userId is passed when posting rates
        [HttpPost("RateCompany/{selectedCompanyId}/{userId}")]
        public IActionResult Rate(int selectedCompanyId, int userId, CompanyRate rate)
        {
            rate.UserId = userId; // Make sure userId is assigned from the parameter

            var existingRate = _companyrateContext.CompanyRates
                .FirstOrDefault(r => r.CompanyId == selectedCompanyId && r.UserId == userId);

            if (existingRate != null)
            {
                // Update the existing rate
                existingRate.Rate = rate.Rate;
                existingRate.HighQuality = rate.HighQuality;
                existingRate.LowQuality = rate.LowQuality;
                existingRate.Cheap = rate.Cheap;
                existingRate.Expensive = rate.Expensive;
                existingRate.WideSelection = rate.WideSelection;
                existingRate.LimitedSelection = rate.LimitedSelection;
                existingRate.Description = rate.Description;

                _companyrateContext.SaveChanges();

                return Ok("Rating updated successfully");
            }

            _companyrateContext.Add(rate);
            _companyrateContext.SaveChanges();

            return Ok("Rating added successfully");
        }



    }
}
