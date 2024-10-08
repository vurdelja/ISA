using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Medicina.Models
{
    public class CompanyRate
    {
        public int Id { get; set; }

        public double Rate {  get; set; }
        public bool HighQuality { get; set; }
        public bool LowQuality { get; set; }
        public bool Cheap { get; set; }
        public bool Expensive { get; set; }
        public bool WideSelection { get; set; }
        public bool LimitedSelection { get; set; }
        public string Description { get; set; }
        public int CompanyId { get; set; }
        public int UserId { get; set; }

        public CompanyRate()
        {
    /*        HighQuality = false;
            LowQuality = false;
            Cheap = false;
            Expensive = false;
            WideSelection = false;
            LimitedSelection = false;
            Description = string.Empty;
            CompanyId = 0;*/
        }
        public CompanyRate(int id, double rate, bool highQuality, bool lowQuality, bool cheap, bool expensive, bool wideSelection, bool limitedSelection, string description, int companyId)
        {
            Id = id;
            Rate = rate;
            HighQuality = highQuality;
            LowQuality = lowQuality;
            Cheap = cheap;
            Expensive = expensive;
            WideSelection = wideSelection;
            LimitedSelection = limitedSelection;
            Description = description;
            CompanyId = companyId;
            UserId = UserId;
        }
    }
}
