using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Server.Models;
using Server.Services;
using Server.Helpers;

namespace Server.Controllers {
    [Route("api/[controller]")]
    [Produces("application/json")]
    [Authorize]
    [ApiController]
    public class SupermarketBrandController : ControllerBase {
        private ISupermarketBrandService _supermarketBrandService;

        public SupermarketBrandController(ISupermarketBrandService supermarketBrandService) {
            _supermarketBrandService = supermarketBrandService;
        }

        // POST: api/SupermarketBrand
        [HttpPost]
        [Authorize(Policy = "AdminClaim")]
        public IActionResult Create(SupermarketBrand supermarketBrand) {
            try {
                var superBrand = _supermarketBrandService.Create(supermarketBrand);
                return Ok(superBrand);
            } catch(AppException ex) {
                return BadRequest(new { message = ex.Message });
            }
        }
        
        // GET: api/SupermarketBrand
        [HttpGet]
        [AllowAnonymous]
        public IActionResult GetAll() => new JsonResult(_supermarketBrandService.ReadAll().ToArray());

        // PUT: api/SupermarketBrand/5
        [HttpPut("{id}")]
        [Authorize(Policy = "AdminClaim")]
        public IActionResult Update(string id, SupermarketBrand supermarketBrand) {
            if(id != supermarketBrand.id) // Validate ids
                return BadRequest(new { message = "IDs don't match." });
            return Ok(_supermarketBrandService.Update(supermarketBrand)); // Call the service
        }

        // DELETE: api/SupermarketBrand/5
        [HttpDelete("{id}")]
        [Authorize(Policy = "AdminClaim")]
        public IActionResult Delete(string id) => Ok(_supermarketBrandService.Delete(id)); // Call the service
    }
}