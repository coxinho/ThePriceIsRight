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
    public class ProductController : ControllerBase {
        private IProductService _productService;

        public ProductController(IProductService productService) {
            _productService = productService;
        }

        // POST: api/Product
        [HttpPost]
        public IActionResult Create(Product product) {
            try {
                _productService.Create(product);
                return Ok();
            } catch(AppException ex) {
                return BadRequest(new { message = ex.Message });
            }
        }
        
        // GET: api/Product
        // GET: api/Product?search=Nestle
        [AllowAnonymous]
        [HttpGet]
        public JsonResult GetProducts(string search) => new JsonResult(_productService.Search(search).ToArray());

        // GET: api/Product/5
        [AllowAnonymous] // Qualquer utilizador, mesmo que não esteja logado, pode ver os productos disponíveis (por id)
        [HttpGet("{id}")]
        public JsonResult GetProduct(string id) => new JsonResult(_productService.Read(id));

        // PUT: api/Product/5
        [HttpPut("{id}")]
        public void Update(string ean, Product product) { // É necessário um utilizador estar logado para poder actualizar um producto
            if(ean == product.ean) // Validar ids
                _productService.Update(product); // Actualizar producto na base de dados
        }

        // DELETE: api/Product/5
        [HttpDelete("{id}")]
        [Authorize(Policy = "AdminClaim")] // Só administradores é que podem apagar productos
        public void Delete(string id) => _productService.Delete(id); // Apagar producto na base de dados
    }
}