using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Server.Entities;
using Server.Services;
using Server.Helpers;

namespace ThePriceIsRightApi.Controllers {
    [Route("api/[controller]")]
    [Produces("application/json")]
    [Authorize]
    [ApiController]
    public class ProductController : ControllerBase {
        private IProductServiceMongo _productService;

        public ProductController(IProductServiceMongo productService) {
            _productService = productService;
        }

        // POST: api/Product
        [HttpPost]
        [Authorize(Policy = "AdminClaim")] // Só administradores é que podem criar productos
        public IActionResult Create(Product product) {
            try {
                _productService.Create(product); // Criar novo producto na base de dados
                return Ok();
            } catch(AppException ex) {
                return BadRequest(new { message = ex.Message }); // Retornar mensagem de erro se ocorreu uma excepção
            }
        }
        
        // GET: api/Product
        // GET: api/Product?search=Nestle
        [AllowAnonymous] // Qualquer utilizador, mesmo que não esteja logado, pode ver os productos disponíveis
        [HttpGet]
        public JsonResult GetProducts(string search) => new JsonResult(_productService.GetProducts(search).ToArray());

        // GET: api/Product/5
        [AllowAnonymous] // Qualquer utilizador, mesmo que não esteja logado, pode ver os productos disponíveis (por id)
        [HttpGet("{id}")]
        public JsonResult GetProduct(string id) => new JsonResult(_productService.GetProduct(id));

        // PUT: api/Product/5
        [HttpPut("{id}")]
        public void Update(string id, Product product) { // É necessário um utilizador estar logado para poder actualizar um producto
            if(id == product.Id) // Validar ids
                _productService.Update(product); // Actualizar producto na base de dados
        }

        // DELETE: api/Product/5
        [HttpDelete("{id}")]
        [Authorize(Policy = "AdminClaim")] // Só administradores é que podem apagar productos
        public void Delete(string id) => _productService.Delete(id); // Apagar producto na base de dados
    }
}