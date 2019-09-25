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
    public class PriceController : ControllerBase {
        private IPriceService _priceService;

        public PriceController(IPriceService priceService) {
            _priceService = priceService;
        }

        // POST: api/Price
        [HttpPost]
        public IActionResult Create(Price price) {
            try {
                _priceService.Create(price);
                return Ok();
            } catch(AppException ex) {
                return BadRequest(new { message = ex.Message });
            }
        }

        // GET: api/Price/5
        [AllowAnonymous] // Qualquer utilizador, mesmo que não esteja logado, pode ver os priceos disponíveis (por id)
        [HttpGet("{id}")]
        public JsonResult GetPrice(string id) => new JsonResult(_priceService.Read(id));

        // PUT: api/Price/5
        [HttpPut("{id}")]
        public void Update(string ean, Price price) { // É necessário um utilizador estar logado para poder actualizar um priceo
            if(ean == price.ean) // Validar ids
                _priceService.Update(price); // Actualizar priceo na base de dados
        }

        // DELETE: api/Price/5
        [HttpDelete("{id}")]
        [Authorize(Policy = "AdminClaim")] // Só administradores é que podem apagar priceos
        public void Delete(string id) => _priceService.Delete(id); // Apagar priceo na base de dados
    }
}