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
    public class SupermarketLocationController : ControllerBase {
        private ISupermarketLocationService _supermarketLocationService;

        public SupermarketLocationController(ISupermarketLocationService supermarketLocationService) {
            _supermarketLocationService = supermarketLocationService;
        }

        // POST: api/SupermarketLocation
        [HttpPost]
        public IActionResult Create(SupermarketLocation supermarketLocation) {
            try {
                return Ok(_supermarketLocationService.Create(supermarketLocation));
            } catch(AppException ex) {
                return BadRequest(new { message = ex.Message });
            }
        }
        
        // GET: api/SupermarketLocation
        // GET: api/SupermarketLocation?search=Jumbo
        [AllowAnonymous]
        [HttpGet]
        public JsonResult Search(string search) => new JsonResult(_supermarketLocationService.Search(search).ToArray());

        // PUT: api/SupermarketLocation/5
        [HttpPut("{id}")]
        public void Update(string id, SupermarketLocation supermarketLocation) { // É necessário um utilizador estar logado para poder actualizar um producto
            if(id == supermarketLocation.id) // Validar ids
                _supermarketLocationService.Update(supermarketLocation); // Actualizar producto na base de dados
        }

        // DELETE: api/SupermarketLocation/5
        [HttpDelete("{id}")]
        [Authorize(Policy = "AdminClaim")] // Só administradores é que podem apagar productos
        public void Delete(string id) => _supermarketLocationService.Delete(id); // Apagar producto na base de dados
    }
}