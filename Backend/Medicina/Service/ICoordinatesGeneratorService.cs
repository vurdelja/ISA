using System.Threading.Tasks;
using Medicina.Models;

namespace Medicina.Services
{
    public interface ICoordinateGeneratorService
    {
        Task<EquipmentTracking> GenerateCoordinates(int equipmentId);
    }
}
